const list = {
    q: [],
    addItems(items){
        this.q = [...this.q, ...items];
    },
    getNext(){
        return this.q.find(item => item.status === "new");
    },
    find(id){
        return this.q.find((item) => item.id === id);
    }
};

module.exports = list;
