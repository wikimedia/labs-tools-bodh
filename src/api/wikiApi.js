export default function WikiApi() {
    this.api = 'https://www.wikidata.org/w/api.php';
    this.sparql_url = 'https://query.wikidata.org/sparql';
    this.sparql_query = function (text, cb, cb_fail) {
        var url = this.sparql_url + "?format=json&query=" + encodeURIComponent(text);
        fetch(url)
            .then((res) => res.json())
            .catch(cb_fail)
            .then((d) => cb(d));
    }
    this.sparql_items = function (text, cb, cb_fail) {
        var self = this;
        self.sparql_query(text, function (resp) {
            if (typeof resp == 'undefined') {
                cb_fail();
                return;
            }
            var data = [];
            var vars = resp.head.vars[0];
            // Make sure only 500 query at a time.
            // TODO: Make tool more flexiable to hanle more request
            for (let i = 0; i < resp.results.bindings.length; i++) {
                if (data.length >= 500) {
                    break
                }
                const d = resp.results.bindings[i][vars];
                if (d === "" || typeof d == 'undefined') continue;
                if (d.type !== 'uri') continue;
                const temp = d.value.replace(/^.+\/([L])/, '$1')
                // Check whether the item is lexeme or not 
                if (temp.startsWith('L') === false) {
                    alert("First column of the query should contain only LXXXX values");
                    break;
                }
                // Don't push duplicate item
                if (data.indexOf(temp) === -1) {
                    data.push(temp)
                }
            };
            console.log(data.length)
            cb(data);
        }, cb_fail);
    }
}