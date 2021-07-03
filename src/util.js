import wdSiteApi from './api/wikidataSiteApi'

/**
 * Return the item type of item
 * @param  {string} item - Item id
 * @return  {string} Item type
 */
export function getTypeByString(item) {
    if (item[0] === 'Q') {
        return 'wikibase-item'
    } else if (item[0] === 'L') {
        return 'wikibase-lexeme'
    } else {
        return 'string'
    }
}

/**
 * Return current tool's supported property
 * @param  {string} item type
 * @todo Allow more kinds of properties
 * @return  {boolean}
 */
export function allowProperties(item) {
    return ['wikibase-item', 'wikibase-lexeme', 'string', 'external-id'].includes(item)
}

/**
 * Return property data
 * @param  {string} Property id
 * @return {object}
 * @return {boolean} In case, some error
 */
export const getPropById = async (id) => {
    if (id[0] !== 'P') {
        alert('Property must start with P i.e. P82')
        return false
    }
    // Taking response from wikidata about property
    let resp;
    try {
        resp = await wdSiteApi.get('/api.php?action=wbgetentities&format=json&origin=*&ids=' + id)
    } catch {
        alert('Something went wrong with network/backed.')
        return false
    }

    // Check whether property is created on wiki or not
    if (resp.data.entities[id].missing) {
        alert(`{id} does not exists on the wiki.`)
        return false
    }

    // Check whether this property allowed or not
    if (allowProperties(resp.data.entities[id].datatype) === false) {
        alert('Tool does not support this property right now :(');
        return false;
    }

    // Extracting data
    const labels = resp.data.entities[id].labels;
    const dataType = resp.data.entities[id].datatype;

    let temp;
    // Try to extract english verion first
    try {
        temp = {
            id: id,
            text: labels.en.value,
            type: dataType
        }
    } catch {
        temp = {
            id: id,
            text: labels.Object.keys(labels)[0].value,
            type: dataType
        }
    }

    return temp;
}

/**
 * Add new lexeme statment data
 * @param  {object} lexItemsData Lexeme's item data in redux state
 * @param  {string} itemId - Item id
 * @param  {string} pId - Property id
 * @param  {object} data - Add to data in lexeme's items data
 * @return {object} new state for redux
 */
export function addClaimInState(lexItemsData, itemId, pId, data) {
    let temp = [...lexItemsData]
    // Taking j as index to store item path indexes
    let j;
    temp.find((i, index) => {
        if (i.id === itemId) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    try {
        temp[j].claims[pId] = [...temp[j].claims[pId], data]
    } catch {
        temp[j].claims[pId] = [data]
    }

    return temp

}

export function addSenseClaimInState(lexItemsData, itemId, pId, data) {
    let temp = [...lexItemsData]
    // Taking j as index to store item path indexes
    let j;
    temp.find((i, index) => {
        if (i.id === itemId.split('-')[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    let k;
    temp[j].senses.find((i, index) => {
        if (i.id === itemId ) {
            k = index; // Storing index to use later
            return true
        }
        return false
    })

    try {
        temp[j].senses[k].claims[pId] = [...temp[j].senses[k].claims[pId], data]
    } catch {
        temp[j].senses[k].claims[pId] = [data]
    }

    return temp

}

export function addFormClaimInState(lexItemsData, itemId, pId, data) {
    let temp = [...lexItemsData]
    // Taking j as index to store item path indexes
    let j;
    temp.find((i, index) => {
        if (i.id === itemId.split('-')[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    let k;
    temp[j].forms.find((i, index) => {
        if (i.id === itemId ) {
            k = index; // Storing index to use later
            return true
        }
        return false
    })

    try {
        temp[j].forms[k].claims[pId] = [...temp[j].forms[k].claims[pId], data]
    } catch {
        temp[j].forms[k].claims[pId] = [data]
    }

    return temp

}

/**
 * Edit lexeme statment's data
 * @param  {object} lexItemsData Lexeme's item data in redux state
 * @param  {string} id - Item id
 * @param  {object} p - Property object contains type and id
 * @param  {string} newValue - new value
 * @return {object} new state for redux
 */
export function editClaimInState(lexItemsData, id, p, newValue) {
    let temp = [ ...lexItemsData ];

    // Taking i and j as index to store item path indexes
    let j, k;
    let tempItem = lexItemsData.find((i, index) => {
        if (i.id === id.split("$")[0]) {
            j = index       // Storing index to use later
            return true
        }
        return false
    })
    tempItem.claims[p.id].find((i, index) => {
        if (i.id === id) {
            k = index
            return true
        }
        return false
    })

    //  Modifing the record in large state object
    if (p.type === "wikibase-lexeme" || p.type === "wikibase-item") {
        temp[j].claims[p.id][k].mainsnak.datavalue.value.id = newValue.id
        temp[j].claims[p.id][k].mainsnak.datavalue.value["numeric-id"] = parseInt(newValue.id.slice(1))
    } else {
        temp[j].claims[p.id][k].mainsnak.datavalue.value = newValue
    }

    return temp
}

export function editSenseClaimInState(lexItemsData, id, p, newValue) {
    let temp = [ ...lexItemsData ];

    // Taking j, k and m as index to store item path indexes
    let j, k, m;
    temp.find((i, index) => {
        if (i.id === id.split('-')[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].senses.find((i, index) => {
        if (i.id === id.split('$')[0] ) {
            k = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].senses[k].claims[p.id].find( (i, index) => {
        if (i.id === id ) {
            m = index; // Storing index to use later
            return true
        }
        return false
    });

    //  Modifing the record in large state object
    if (p.type === "wikibase-lexeme" || p.type === "wikibase-item") {
        temp[j].senses[k].claims[p.id][m].mainsnak.datavalue.value.id = newValue.id
        temp[j].senses[k].claims[p.id][m].mainsnak.datavalue.value["numeric-id"] = parseInt(newValue.id.slice(1))
    } else {
        temp[j].senses[k].claims[p.id][m].mainsnak.datavalue.value = newValue
    }

    return temp
}


export function editFormClaimInState(lexItemsData, id, p, newValue) {
    let temp = [ ...lexItemsData ];

    // Taking j, k and m as index to store item path indexes
    let j, k, m;
    temp.find((i, index) => {
        if (i.id === id.split('-')[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].forms.find((i, index) => {
        if (i.id === id.split('$')[0] ) {
            k = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].forms[k].claims[p.id].find( (i, index) => {
        if (i.id === id ) {
            m = index; // Storing index to use later
            return true
        }
        return false
    });

    //  Modifing the record in large state object
    if (p.type === "wikibase-lexeme" || p.type === "wikibase-item") {
        temp[j].forms[k].claims[p.id][m].mainsnak.datavalue.value.id = newValue.id
        temp[j].forms[k].claims[p.id][m].mainsnak.datavalue.value["numeric-id"] = parseInt(newValue.id.slice(1))
    } else {
        temp[j].forms[k].claims[p.id][m].mainsnak.datavalue.value = newValue
    }

    return temp
}

/**
 * Delete lexeme statment's data
 * @param  {object} lexItemsData Lexeme's item data in redux state
 * @param  {string} id - Item id
 * @param  {object} p - Property object contains type and id
 * @return {object} new state for redux
 */
export function deleteClaimInState(lexItemsData, id, p) {
    let temp = [...lexItemsData]

    // Taking j as index to store item path indexes
    let j;
    let tempItem = lexItemsData.find((i, index) => {
        if (i.id === id.split("$")[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].claims[p.id] = tempItem.claims[p.id].filter(obj => obj.id !== id)

    return temp
}

export function deleteSenseClaimInState(lexItemsData, id, p) {
    let temp = [...lexItemsData]

    // Taking j as index to store item path indexes
    let j, k;
    temp.find((i, index) => {
        if (i.id === id.split('-')[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].senses.find((i, index) => {
        if (i.id === id.split('$')[0] ) {
            k = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].senses[k].claims[p.id] = temp[j].senses[k].claims[p.id].filter( it => it.id !== id);

    return temp
}

export function deleteFormClaimInState(lexItemsData, id, p) {
    let temp = [...lexItemsData]

    // Taking j as index to store item path indexes
    let j, k;
    temp.find((i, index) => {
        if (i.id === id.split('-')[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].forms.find((i, index) => {
        if (i.id === id.split('$')[0] ) {
            k = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].forms[k].claims[p.id] = temp[j].forms[k].claims[p.id].filter( it => it.id !== id);

    return temp
}

export function deleteSenseInState(lexItemsData, id) {
    let temp = [...lexItemsData]

    // Taking j as index to store item path indexes
    let j;
    let tempItem = lexItemsData.find((k, index) => {
        if (k.id === id.split("-")[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].senses = tempItem.senses.filter( it => it.id !== id)

    return temp
}

export function deleteFormInState(lexItemsData, id) {
    let temp = [...lexItemsData]

    // Taking j as index to store item path indexes
    let j;
    let tempItem = lexItemsData.find((k, index) => {
        if (k.id === id.split("-")[0]) {
            j = index; // Storing index to use later
            return true
        }
        return false
    })

    temp[j].forms = tempItem.forms.filter( it => it.id !== id)

    return temp
}

/**
 * Return supported input language
 * @return {array} List of language code
 */
 export function allowedInputLanguage() {
    return [
        'as',
        'bn',
        'de',
        'en',
        'fr',
        'gu',
        'hi',
        'kn',
        'ml',
        'mr',
        'or',
        'pa',
        'sa',
        'ta',
        'te'
    ]
}