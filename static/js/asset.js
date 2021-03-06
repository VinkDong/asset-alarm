var vm = new Vue({
    el: "#app",
    data: {
        title:"Hello Asset Alarm",
        context: {
            pages:{
                add_item_page: "./add.html",
                view_bill_page: "./bill.html",
            }
        },
        change_amount:"",
        credits:[],
        editing: false,
        curItem: ""
    },
    filters: {
        formatMoney(value) {
            return "¥" + value;
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.listView();
        });
    },
    methods: {
        listView: function () {
            this.$http.get("/api/list").then(res=>{
                this.credits = res.body.credits;
            })
        },
        itemClick: function (item) {
            this.curItem = item;
            this.editing = true;
        },
        modelClose: function () {
            this.editing = false;
        },
        addRecord: function (type) {
            let cur = this.curItem;
            let amount = 0;
            if (type == 'in') {
                amount = -parseFloat(this.change_amount);
            } else {
                amount = parseFloat(this.change_amount);
            }
            if(amount == 0){
                return;
            }
            let date = new Date();
            this.$http.post("/api/record/add", {
                version: "v0.1",
                record: {
                    cid: cur.id,
                    type: amount > 0 ? "out" : "in",
                    credit: cur.credit,
                    debit: cur.debit + amount,
                    amount: amount,
                    time: VDate.getNow()
                }
            }).then(res => {
                if (!!res.body.success) {
                    location.href = "/";
                }
            });
        }
    }
});

var bill= new  Vue({
    el: "#bill",
    data: {
        title: "View Bill",
        credit: 0,
        debit: 0,
        account_date: 1,
        repayment_date: 1,
        balance: 0,
        name:"VinK Bank",
        icon: "../icon/vink.logo"
    },
    filters: {

    },
    mounted: function () {

    },
    methods: {

    }
});

var add = new Vue({
    el: "#app-add",
    data: {
        title: "Hello add asset",
        credit: 0,
        debit: 0,
        account_date: 1,
        repayment_date: 1,
        balance: 0,
        name:"VinK Bank",
        icon: "../icon/vink.logo"
    },
    filters: {

    },
    mounted: function () {

    },
    methods: {
        addItem: function () {
            this.$http.post("/api/item/add", {
                version: "v0.1",
                credit: {
                    name: this.name,
                    icon: "../icon/vink.logo",
                    credit: parseFloat(this.credit),
                    debit: parseFloat(this.debit),
                    balance: parseFloat(this.balance),
                    account_date: parseInt(this.account_date),
                    repayment_date: parseInt(this.repayment_date)
                }
            }).then(res => {
                if(!!res.body.success){
                    location.href="/";
                }
            });
        },
        addItemCancel: function () {
            location.href="/";
        }
    }
});

Vue.filter("money",function (value,symbol) {
    return symbol+value;
});

var VDate = {
    getNow: function () {
        let date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
};