let app = new Vue({
    el: "#app",
    data: {
        quote: '',
        author: '',
        board: [],
        showForm: false,
        user: null,
        username: '',
        password: '',
        error: '',
    },
    created: function() {
        this.getQuotes();
        this.getUser();

    },
    methods: {

        toggleForm() {
            this.error = "";
            this.username = "";
            this.password = "";
            this.showForm = !this.showForm;
        },
        async register() {
            this.error = "";
            try {
                let response = await axios.post("/api/users", {
                    username: this.username,
                    password: this.password
                });
                this.user = response.data;
                // close the dialog
                this.toggleForm();
            }
            catch (error) {
                this.error = error.response.data.message;
            }
        },
        async login() {
            this.error = "";
            try {
                let response = await axios.post("/api/users/login", {
                    username: this.username,
                    password: this.password
                });
                this.user = response.data;
                // close the dialog
                this.toggleForm();
            }
            catch (error) {
                this.error = error.response.data.message;
            }
        },
        async logout() {
            try {
                this.user = null;
                let response = await axios.delete("/api/users");
            }
            catch (error) {
                // don't worry about it
            }
        },
        async getUser() {
            try {
                let response = await axios.get("/api/users");
                this.user = response.data;
            }
            catch (error) {
                // Not logged in. That's OK!
            }
        },

        async getQuotes() {
            try {
                let response = await axios.get("/quotes");
                this.board = response.data;
                console.log(this.board);
                console.log(response.data);
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },
        addItem() {
            if (this.quote.trim() !== '') {
                var url = "/quotes";
                axios.post(url, {
                        quote: this.quote.trim(),
                        author: this.author,
                    })
                    .then(response => {})
                    .catch(e => {
                        console.log(e);
                    });
                this.quote = '';
                this.author = '';
                this.getQuotes();
            }
        },
        async deleteQuote(item) {
            try {
                if (this.user == NULL) {
                    return;
                }
                let response = await axios.delete("/quotes/" + item.quote.trim());
                console.log(item.quote);
                this.getQuotes();
                return true;
            }
            catch (error) {
                console.log(error);
            }
        }
    }
});
