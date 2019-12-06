let app = new Vue({
    el: "#app",
    data: {
        quote: '',
        author: '',
        board: [],
    },
    created: function(){
        this.getQuotes();
    },
    methods: {
        async getQuotes() {
          try {
              let response = await axios.get("/quotes");
              this.board = response.data;
              console.log(this.board);
              console.log(response.data);
              return true;
          }
          catch(error) {
              console.log(error);
          }
        },
        addItem(){
            if (this.quote.trim() !== '') {
                var url="/quotes";
                axios.post(url,{
                    quote: this.quote.trim(),
                    author: this.author,
                })
                .then(response=>{})
                .catch(e=>{
                    console.log(e);
                });
                this.quote='';
                this.author='';
                this.getQuotes();
            }
        },
        async deleteQuote(item) {
            try {
                let response = await axios.delete("/quotes/" + item.quote.trim());
                console.log(item.quote);
                this.getQuotes();
                return true;
            }
            catch(error) {
                console.log(error);
            }
        }
    }
});