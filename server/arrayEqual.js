function arrayEqual (first, second){

    if (first.length !== second.length) {        
        return false
    }
     
    for (let i = 0; i < first.length; i++){
        
        if (typeof first[i] !== "object" && typeof second[i] !== "object" ){
                if (first[i]!== second[i]){
                    return false                                      
                }                
        } else {
            if (typeof first[i] == "object" && typeof second[i] == "object" ){
                return arrayEqual(first[i], second[i]);
            } else {                
                return false
            }            
        }  
    }
    return true
} 

module.exports = arrayEqual;