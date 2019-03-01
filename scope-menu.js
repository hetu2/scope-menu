"use strict"
window.onload = function() {

    window.nav = new ScopeMenu('navigation',menu);
    
    console.log(nav)

}

const ScopeMenu = function(elmId,menu) {

    this.elm = document.getElementById(elmId);

    this.init = () => {

        this.rawMenu = Object.assign([], menu); // clone to array []

        this.prepareMenu()

        this.renderMenu(this.rawMenu)

        this.renderFilter();



    }

    this.flatMap = {} // flattened map with menu items

    this.prepareMenu = () => {
        
        let recursio = (node,parent) => {

            node.forEach((n)=> {

                let id = ''

                n.path = []

                if(parent != '') {
                    id += parent.join('/')+'/';
                    n.path = Object.assign([], parent);
                }

                n.path.push(n.title)

                id +=n.title

                n.active = 0

                this.flatMap[id] = n // lets do MAPped 

                if(n.child) {

                    recursio(n.child,n.path)
                }
            
            })

        }

        recursio(this.rawMenu,'');

    }


    this.renderFilter = () => {

        let filterForm = document.createElement('form');
        filterForm.classList.add('filter')
        this.filter = document.createElement('input');
        
        this.filter.addEventListener('change',this.setFilter)
        this.filter.addEventListener('keyup',this.setFilter)
        filterForm.addEventListener('submit',(e)=> {
            e.preventDefault()
            this.setFilter()
        })

        
        let icon = document.createElement('img')
        icon.src = 'filter.svg'

        let button = document.createElement('button')
        button.type = 'submit'
        button.classList.add('filterSubmit')
    
        button.appendChild(icon)
        filterForm.appendChild(button)

        this.clearButton = document.createElement('button');
        this.clearButton.addEventListener('click',this.clearFilter);

        this.clearButton.classList.add('filterClear')

        filterForm.appendChild(this.clearButton)

        filterForm.appendChild( this.filter)

        this.elm.prepend(filterForm)

    }

    this.setFilter = () => {

        let val = this.filter.value;

        if(val.length) {
            this.clearButton.classList.add('show')
        }
        else {
            this.clearButton.classList.remove('show')
        }

        this.filter.value = val;
    }
    this.clearFilter = ()=> {
        this.filter.value = '';
        this.setFilter()
        
    }


    this.renderMenu = (nodes)=> {

        this.breadCrumb = document.createElement('div')
        this.breadCrumb.classList.add('breadCrumb')

        let backButton = document.createElement('button')
        backButton.classList.add('backToggle')
        backButton.addEventListener('click',this.backToggle);

        this.routeElm = document.createElement('a')
        this.routeElm.classList.add('route')
        
        let routeSpan = document.createElement('span')
        this.routeElm.appendChild(routeSpan)

        this.breadCrumb.appendChild(backButton);
        this.breadCrumb.appendChild(this.routeElm);
        this.elm.appendChild(this.breadCrumb);
        
        this.menuElm = document.createElement('div')
        this.menuElm.classList.add('menuElm')
        this.menuElm.style.transform = `translate3d(0px,0px,0px)`
    
        this.menuElm.appendChild(this.renderMenuLayer(nodes))

        this.elm.appendChild(this.menuElm);

        window.addEventListener("hashchange", ()=> {
            
            const hash = decodeURI(window.location.hash);

            const node = this.getNodeByURL(hash);

            if(!Object.keys(node).length) return false;
            
            console.log(node)
            
        });
    
    }


    this.backToggle = () => {

        this.menuElm.querySelector('ul:last-child').remove()
        
        this.activeLayer = this.menuElm.querySelectorAll('ul').length-1

        let move = (this.elm.offsetWidth*this.activeLayer)*-1;
    
        this.menuElm.style.transform = `translate3d(${move}px,0px,0px)`

        let parentPath = Object.assign([], this.activeNode().path);  

        parentPath.pop()

        this.activePath = parentPath.join('/');

        this.renderBreadCrumb()
    }

    this.childToggle = () => {
        this.activeLayer = this.menuElm.querySelectorAll('ul').length

        this.menuElm.appendChild(this.renderMenuLayer(this.activeNode().child))
    }

    this.activeLayer=0;
    this.activePath = '';
    this.activeNode = ()=> {
        
        return this.flatMap[this.activePath]
    }

    this.renderBreadCrumb = () => {

        if(!this.activeLayer) {
            this.breadCrumb.classList.remove('show')
        }
        else {
            this.breadCrumb.classList.add('show')

            this.routeElm.href = this.activeNode().url

            this.routeElm.querySelector('span').innerHTML = this.activeNode().title

        }

    }

    
    this.renderMenuLayer = (nodes)=> {

        this.pendActiveClasses();

        let move = (this.elm.offsetWidth*this.activeLayer)*-1;
        
        this.menuElm.style.transform = `translate3d(${move}px,0px,0px)`

        let ul = document.createElement('ul')
            
        nodes.forEach((m) => {
            
            let a = document.createElement('button')
    
            if(m.url) {
    
                a = document.createElement('a')
                a.setAttribute('href',m.url)
            }
            
            a.innerHTML = m.title;
    
            let li = document.createElement('li')

            if(m.active == 1) {
                li.classList.add('active_path')
            } else if(m.active == 2) {
                li.classList.add('active_node')
            }
            else {

                li.classList.remove('active_path')
                li.classList.remove('active_node')

            }
    

            li.appendChild(a)
    
            if(m.child) {
    
                let childToggle = document.createElement('button');
                childToggle.classList.add('childToggle')
                childToggle.addEventListener('click',()=> {

                    this.activePath = m.path.join('/');

                    this.childToggle();
                })
    
                li.appendChild(childToggle)
            }
    
            ul.appendChild(li)
    
        })

        this.renderBreadCrumb()

        return ul

    }

    this.selectedNode = {}
    
    this.pendActiveClasses = () => {

        let uri = decodeURI(window.location.href)

        let origin = window.location.origin+'/';
        
        for(const k in this.flatMap) {
            const m = this.flatMap[k];

            m.active = 0;

            if(uri == origin+m.url) {

                let activePath = ''

                m.path.forEach((p) => {
                    
                    if(activePath) {
                        activePath += '/'
                    }

                    activePath += p

                    this.flatMap[activePath].active = 1

                });

                m.active = 2;
                this.selectedNode = m;
            }
        }
    }

    this.getNodeByURL = (uri) => {

        let rtn = {}

        for(const k in this.flatMap) {
            const m = this.flatMap[k];

            if(uri == m.url) {

                rtn = m;

            }
        }

        return rtn;

    }

    this.init()

    return this

}


const menu = [ // menuObject
    {
        title: 'Home',
        url: '/'
    },
    {
        title: 'Products',
        url: '#producst',
        child: [
            {
                title: 'Lorem ipsum',
                url: '#producst/Lorem ipsum',
            }, {
                title: 'consectetur',
                url: '#producst/consectetur',
            }, {
                title: 'Adipiscing elit',
                url: '#producst/adipiscing elit',
            }, {
                title: 'Nulla auctor nisl',
                url: '#producst/Nulla auctor nisl',
                child: [
                    {
                        title: 'kolmas taso 1',
                        url: '#producst/Nulla auctor nisl/kolmas taso 1'
                    },
                    {
                        title: 'kolmas taso 2',
                        url: '#producst/Nulla auctor nisl/kolmas taso 2'
                    },{
                        title: 'kolmas taso 3',
                        url: '#producst/Nulla auctor nisl/kolmas taso 3'
                    },{
                        title: 'kolmas taso 4',
                        url: '#producst/Nulla auctor nisl/kolmas taso 4',
                        child: [
                            {
                                title: 'neljäs taso 1',
                                url: '#producst/Nulla auctor nisl/kolmas taso 4/neljäs taso 1'
                            }
                        ]
                    }
                ]
            }, {
                title: 'sit amet ligula blandit',
                url: '#producst/sit amet ligula blandit',
            }, {
                title: ' vehicula. Vestibulum',
                url: '#producst/vehicula. Vestibulum',
                child: [
                    {
                        title: 'kolmas taso 1',
                        url: '#producst/vehicula. Vestibulum/kolmas taso 1'
                    }
                ]
            }
        ]
    },
    {
        title: 'Peoples',
        url: '#peoples',
        child: [
            {
                title:'Matti Meikäläinen',
                url: '#matti meikäläinen'
            },
            {
                title:'Maija Malinen',
                url: '#maija malinen'
            }
        ]
    },
    {
        title: 'Contact us',
        url: '#Contact us'
    }
]






