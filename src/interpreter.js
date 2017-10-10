String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}


var Interpreter = function () {

	rules = {}
	facts = []
	state= false;

	this.linea_legal = function (linea){
		if ( linea.indexOf("(") == -1 || linea.indexOf(")") == -1 || linea.indexOf("(") + 1 >= linea.indexOf(")")){
				return false;
			}

		if (linea == "")
			return false;
    		
		if (linea.slice(-1) != "."){
			return false;
		}
		return true



	}

    this.parseDB = function (bd, sepFact ) {
    	sepFact || ( sepFact = ":- " )
    	for ( i=0 ; i < bd.length; i++){
    		var linea = bd[i].split(sepFact)
    		if (! this.linea_legal(bd[i])){
    			state= false;
    			return ;
    		}
    		if (linea.length == 2){
    			rules[linea[0].split("(")[0]] =  bd[i].slice(0, -1)
    		}
    		else if (linea.length == 1){
    			facts.push(linea[0].slice(0,-1))
    		}
    	}
    	state= true;

   	}


   	this.chekInDic= function (query){
   		var rule = rules[query.split("(")[0]]
    	var paramRule = rule.substring(rule.indexOf("(")+1, rule.indexOf(")"))
    	console.log(paramRule)
     	paramRule = paramRule.split(", ")
    	var paramQuery = query.substring(query.indexOf("(")+1, query.indexOf(")"))
    	paramQuery = paramQuery.split(", ")
    	var ruleParametrizada = rule;
    	for (i=0 ; i < paramQuery.length ; i++){
    	ruleParametrizada = ruleParametrizada.replaceAll(paramRule[i],paramQuery[i])
    	}
    	ruleParametrizada = ruleParametrizada.split(":- ")[1].split("), ").join(")+").split("+")
    	for(i=0 ; i< ruleParametrizada.length; i ++){

    		if(!contains(facts, ruleParametrizada[i])){
    			return false
    		}
    	}

    	return true
   	}
  	

  	this.comprobarQuery = function ( query ){
  		if (query.indexOf("(") ==0 )
  			return false;
  		if ( query.indexOf("(") == -1 || query.indexOf(")") == -1 || query.indexOf("(") + 1 >= query.indexOf(")")){
				return false;
			}

		if (query == "")
			return false;
		return true;
    	
  	}
    this.checkQuery = function (query) {
    	if (! state) return null;  	
    	if ( !this.comprobarQuery(query)) return null;
    	if (contains(facts, query))
        	return true
        else if (rules[query.split("(")[0]] != undefined)
        	return this.chekInDic(query)
        
        else 
        	return false
        	
    }
    
}

module.exports = Interpreter;
