window.onload = function() {

    let nav = new ScopeMenu('navigation');
    
    console.log(nav)

}

const ScopeMenu = function(elmId) {

    this.elm = document.getElementById(elmId);

    this.init = () => {

        this.renderMenu(menu)

        this.renderFilter()

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
        backButton.addEventListener('click',() => {

            this.menuElm.querySelector('ul:last-child').remove()
        
            this.activeLayer = this.menuElm.querySelectorAll('ul').length-1

            let move = (this.elm.offsetWidth*this.activeLayer)*-1;
        
            this.menuElm.style.transform = `translate3d(${move}px,0px,0px)`

            this.route.pop();

            this.renderBreadCrumb()

        });

        this.routeElm = document.createElement('div')
        this.routeElm.classList.add('route')

        this.breadCrumb.appendChild(backButton);
        this.breadCrumb.appendChild(this.routeElm);
        this.elm.appendChild(this.breadCrumb);
        
        this.menuElm = document.createElement('div')
        this.menuElm.classList.add('menuElm')
        this.menuElm.style.transform = `translate3d(0px,0px,0px)`
    
        this.menuElm.appendChild(this.renderMenuLayer(nodes))

        this.elm.appendChild(this.menuElm);

    }

    this.activeLayer=0;
    this.route = []

    this.renderBreadCrumb = () => {

        if(!this.activeLayer) {
            this.breadCrumb.classList.remove('show')
        }
        else {
            this.breadCrumb.classList.add('show')

            this.routeElm.innerHTML = this.route.join(" / ")

        }

    }

    
 

    this.renderMenuLayer = (nodes)=> {

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
    
            li.appendChild(a)
    
            if(m.child) {
    
                let childToggle = document.createElement('button');
                childToggle.classList.add('childToggle')
                childToggle.addEventListener('click',()=> {
                    this.childToggle(m)
                })
    
                li.appendChild(childToggle)
            }
    
            ul.appendChild(li)
    
        })

        this.renderBreadCrumb()

        return ul

    }

    this.childToggle = (m) => {
        this.activeLayer = this.menuElm.querySelectorAll('ul').length

        this.route.push(m.title)

        this.menuElm.appendChild(this.renderMenuLayer(m.child))
    }


    this.init()

    return this

}


const menu = [ // menuObject
    {
        title: 'Home',
        url: '#home'
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
                title: ' adipiscing elit. ',
                url: '#producst/adipiscing elit',
            }, {
                title: 'Nulla auctor nisl ',
                url: '#producst/Nulla auctor nisl',
                child: [
                    {
                        title: 'kolmas taso',
                        url: 'dsa'
                    },
                    {
                        title: 'kolmas taso',
                        url: 'dsa'
                    },{
                        title: 'kolmas taso',
                        url: 'dsa'
                    },{
                        title: 'kolmas taso',
                        url: 'dsa',
                        child: [
                            {
                                title: 'neljäs taso',
                                url: 'dsa'
                            }
                        ]
                    }
                ]
            }, {
                title: 'sit amet ligula blandit ',
                url: '#producst/sit amet ligula blandit',
            }, {
                title: ' vehicula. Vestibulum',
                url: '#producst/vehicula. Vestibulum',
                child: [
                    {
                        title: 'kolmas taso',
                        url: 'dsa'
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
                url: 'matti meikäläinen'
            },
            {
                title:'Maija Malinen',
                url: 'maija malinen'
            }
        ]
    },
    {
        title: 'Contact us',
        url: '#Contact us'
    }
]






