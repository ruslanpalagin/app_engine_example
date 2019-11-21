const list = {
    q: [],
    addItems(items){
        this.q = [...this.q, ...items];
    },
    getNext(){
        return this.q.find(item => item.status === "new");
    },
};

module.exports = list;
