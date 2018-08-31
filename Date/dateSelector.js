import { isObject } from "util";

export class DatePicker {
    constructor(dom, startDate, endDate) {
        this.dom = typeof dom === 'object' ? dom : document.querySelector(dom);
        this.startDate = new Date(startDate) || new Date();
        this.endDate = new Date(endDate) || null;
        this.date = {
            fullDate: '',
            year: '',
            month: '',
            day: ''
        },
            this.ready = false;
        this.watching = false;
        this.checkScrolling = null;
        // this.year = '';
        // this.month = '';
        // this.day = '';
        this.defineEnv();

        this.scrolling = false;
        this.scrollTop = 0;

        //时间控件
        document.querySelector(dom).addEventListener('click', e => {

            this.getCurrentDate();
            this.drawCover();

            this.drawDateSelector();

            this.setDate();
            this.scrolling = false;
            //console.log(checkScrolling)



            document.querySelector('#dateSConf').addEventListener('click', (e) => this.dateConf(e), false)
            document.querySelector('#dateSCancel').addEventListener('click', (e) => this.dateClose(e), false)

            setTimeout(() => {
                document.querySelector('.dateSYear').addEventListener('scroll', (e) => this.defineDate(e, 'year'), false)
                document.querySelector('.dateSMonth').addEventListener('scroll', (e) => this.defineDate(e, 'month'), false)
                document.querySelector('.dateSDay').addEventListener('scroll', (e) => this.defineDate(e, 'day'), false)
            }, 500)
            this.ready = true;
        }, false)


    }

    // 手机环境
    defineEnv() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }


    // 背部阴影
    drawCover() {
        let cover = document.createElement('div');
        let left = document.documentElement.scrollLeft;
        let top = document.documentElement.scrollTop;
        cover.className = 'dateSCover';
        cover.style.position = 'absolute';
        cover.style.width = '100vw';
        cover.style.height = '100vh';
        cover.style.background = 'rgba(0, 0, 0, .3)';
        cover.style.top = top + 'px';
        cover.style.left = left + 'px';
        cover.style.zIndex = '10';
        document.querySelector('body').style.overflow = 'hidden';
        document.querySelector('body').appendChild(cover);
    }




    // 日期选框
    drawDateSelector() {
        let box = document.createElement('div');
        let left = document.documentElement.scrollLeft;
        let top = document.documentElement.scrollTop;

        box.style.background = 'white';
        box.style.borderRadius = '5px';
        box.style.padding = '.1rem';
        box.style.height = '28vh';
        box.style.width = '50vw';
        box.style.zIndex = '11';
        box.style.position = 'absolute';
        box.style.top = `calc( ${top}px + 25vh)`;
        box.style.left = `calc( 50vw - ${box.style.width} / 2  )`;
        box.className = 'dateSelect';


        let header = `<div class='dateSHeader' style='display: flex; justify-content: space-around;'>
            <span></span>
            <span>请选择日期</span>
            <span></span>
        </div>`;


        let body = `<div class='dateSBody' style='display: flex; justify-content: space-around; margin-top: .5rem;'>
            <div style='width: 35%; position: relative;'>
                <div class='dateSSelect'></div>
                <div style='height: 1.2rem; overflow:scroll;' class='dateSYear'>
                    <span></span>
                    <span name='2016'>2016年</span>
                    <span name='2017'>2017年</span>
                    <span name='2018'>2018年</span>
                    <span name='2019'>2019年</span>
                    <span name='2020'>2020年</span>
                    <span></span>
                </div>
            </div>

            <div style='width: 30%; position: relative;'>
                <div class='dateSSelect'></div>
                <div style='height: 1.2rem; overflow:scroll;' class='dateSMonth'>
                    <span></span>
                    <span>1月</span>
                    <span>2月</span>
                    <span>3月</span>
                    <span>4月</span>
                    <span>5月</span>
                    <span>6月</span>
                    <span>7月</span>
                    <span>8月</span>
                    <span>9月</span>
                    <span>10月</span>
                    <span>11月</span>
                    <span>12月</span>
                    <span></span>
                </div>
            </div>

            <div style='width: 30%; position: relative;'>
                <div class='dateSSelect'></div>
                <div style='height: 1.2rem; overflow:scroll;' class='dateSDay'>
                    <span></span>
                    <span>1日</span>
                    <span></span>
                </div>
            </div>
        
        
        </div>`;

        let footer = `<div class='dateSFooter' style='display: flex; justify-content: space-around; margin-top: .3rem;'>
            <button id='dateSConf' style='width: 50%; height: .5rem;'>确定</button>
            <button id='dateSCancel' style='width: 50%; height: .5rem;'>取消</button>
        </div>`

        box.innerHTML = header + body + footer;

        document.querySelector('body').appendChild(box);
        this.styleSet();
    }


    // 获取input时间
    getCurrentDate() {
        // let innerDate = this.dom.value || this.dom.innerHTML;
        // return innerDate;
        let wholeDate = this.dom.value || this.dom.innerHTML
        let date = new Date(wholeDate);

        this.date.year = date.getFullYear();
        this.date.month = date.getMonth() + 1;
        this.date.day = date.getDate();
    }


    //替换日期日期
    replaceDay() {
        let days = (new Date(this.date.year * 1, this.date.month * 1, 0)).getDate();
        let content = ' <span style="display: block; font-size:.24rem; text-align: center; height: .4rem; line-height: .4rem;"></span>';
        for (let i = 0; i < days; i++) {
            content += ` <span style="display: block; font-size:.24rem; text-align: center; height: .4rem; line-height: .4rem;">${i + 1}日</span>`;
        }
        content += ' <span style="display: block; font-size:.24rem; text-align: center; height: .4rem; line-height: .4rem;"></span>';
        return content;
    }

    //设置日期（对应输入值）
    setDate() {
        console.log(this.date);
        if (!(this.date.year && this.date.month && this.date.day)) return;


        let domYear = document.querySelector('.dateSYear');
        let domMonth = document.querySelector('.dateSMonth');
        let domDay = document.querySelector('.dateSDay');
        let height = domYear.childNodes[1].offsetHeight;
        let currYear = Array.from(document.querySelectorAll('span')).filter(v => v.getAttribute('name') * 1 === this.date.year)[0]
        let currMonth = Array.from(document.querySelectorAll('span')).filter(v => v.innerHTML.slice(0, -1) * 1 === this.date.month)[0]
        let currDay = Array.from(document.querySelectorAll('span')).filter(v => v.innerHTML.slice(0, -1) * 1 === this.date.day)[0]

        domYear.scrollTop = currYear.offsetTop - height;
        domMonth.scrollTop = currMonth.offsetTop - height;
        domDay.scrollTop = currDay.offsetTop - height;

        //debugger;
        this.scrolling = false;
    }





    // 滚动监视
    defineDate(e, name) {
        if (!this.ready) return;
        this.scrollTop = e.target.scrollTop;
        // console.log('scrollTop', e.target)
        // console.log('scrolling', this.scrollTop)
        if (!this.scrolling) {
            this.scrolling = true;
            this.checkScrolling = setInterval(() => {
                console.log('scrolling');
                //console.log('data', this.scrollTop)
                // console.log('mouse', e.target)
                if (this.scrollTop === e.target.scrollTop) {
                    //console.log('complete');
                    clearInterval(this.checkScrolling);
                    this.scrolling = false;

                    this.smoothScroll(e.target, name)
                    if (name === 'year' || name === 'month') {
                        //console.log(this.replaceDay())
                        document.querySelector('.dateSDay').innerHTML = this.replaceDay();
                    }
                }

            }, 100)
        } else {
            this.scrollTop = e.target.scrollTop;
            clearInterval(this.checkScrolling);
            this.checkScrolling = setInterval(() => {
                console.log('new Scrolling');
                //console.log('data', this.scrollTop)
                // console.log('mouse', e.target)
                if (this.scrollTop === e.target.scrollTop) {
                    //console.log('complete');
                    clearInterval(this.checkScrolling);
                    this.scrolling = false;

                    this.smoothScroll(e.target, name)
                    if (name === 'year' || name === 'month') {
                        //console.log(this.replaceDay())
                        document.querySelector('.dateSDay').innerHTML = this.replaceDay();
                    }
                }

            }, 100)
        }

    }

    // 滚动到临近节点
    smoothScroll(dom, name) {
        dom = typeof dom === 'object' ? dom : document.querySelector(dom);

        console.log(dom);
        let height = dom.childNodes[1].offsetHeight;
        let fixHeight = Math.round(dom.scrollTop / height) * height;
        dom.scrollTop = fixHeight;
        let currDom = (fixHeight / height + 2) * 2;
        let content = dom.childNodes[currDom - 1].innerHTML
        this.date[name] = content.substr(0, content.length - 1);
        //console.log(this.date);
        //debugger;
        this.scorlling = false;
    }


    // 确认
    dateConf(e) {
        this.ready = false;
        this.smoothScroll('.dateSYear', 'year')
        this.smoothScroll('.dateSMonth', 'month')
        this.smoothScroll('.dateSDay', 'day')

        let date = this.date.year + '-' + this.date.month + '-' + this.date.day;


        if (this.dom.nodeName === 'DIV') {
            this.dom.innerHTML = date;
        }
        if (this.dom.nodeName === 'INPUT') {
            this.dom.value = date;
        }


        this.dateClose();
        setTimeout(() => {
            clearInterval(this.checkScrolling)
            this.checkScrolling = null;
            this.ready = true;
        }, 300)

    }

    dateClose() {
        this.closeBox();
    }


    closeBox() {
        let cover = document.querySelector('.dateSCover');
        let dateSelector = document.querySelector('.dateSelect');
        cover.parentNode.removeChild(cover);
        dateSelector.parentNode.removeChild(dateSelector);
        this.ready = false;
    }



    styleSet() {
        Array.from(document.querySelectorAll('.dateSelect span')).forEach(function (v, i) {
            v.style.fontSize = '.24rem';
            v.style.display = 'block';
            v.style.height = '.4rem'
            v.style.lineHeight = '.4rem';
            v.style.textAlign = 'center';
        })
        Array.from(document.querySelectorAll('.dateSBody .dateSSelect')).forEach(function (v, i) {
            v.style.border = '1px solid black';
            v.style.height = '.4rem';
            v.style.width = '100%';
            v.style.position = 'absolute';
            v.style.top = '.4rem';
            v.style.pointerEvents = 'none';
        })

    }





}




