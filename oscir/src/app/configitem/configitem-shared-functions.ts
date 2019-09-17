
import { saveAs } from 'file-saver/dist/FileSaver';

export class ConfigItemSharedFunctions {
    

// ======= FOR CSV Exporting ========

onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

    downloadCsv(data: any) {
        if(!data || data.length==0)
        {
          alert('No records in view to export');
          return;
        }
    
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        //var header = Object.keys(data[0]);
        const ignoreHeaders = ['sourceRelationships', 'targetRelationships', 'deletedOn','deletedBy'];
        /*
        var header = Object.keys(this.flattenObject(data[0])).filter(h =>{       
            if(ignoreHeaders.includes(h)) return false;   
            if(h.startsWith('sourceRelationships')) return false;
            if(h.startsWith('targetRelationships')) return false;
            return true;
          });
        */
       var header = [];
       //get all header values from all rows in case some have different properties
       for(var i=0; i<data.length; i++)
       {  
        var nextHeaders = (Object.keys(this.flattenObject(data[i])).filter(h =>{       
          if(ignoreHeaders.includes(h)) return false;   
          if(h.startsWith('sourceRelationships')) return false;
          if(h.startsWith('targetRelationships')) return false;
          return true;
        }));
        header = header.concat(nextHeaders);
       }
       header = header.filter( this.onlyUnique );
            
        //let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        let csv = data.map(row => {
          var flatRow = this.flattenObject(row);
          return header.map(fieldName => JSON.stringify(flatRow[fieldName], replacer)).join(',')
          });
        
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
    
        var blob = new Blob([csvArray], {type: 'text/csv' })
        saveAs(blob, "configItems.csv");
      }
    
      flattenObject(ob) {
        var toReturn = {};
    
        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) continue;
    
            if ((typeof ob[i]) == 'object' && ob[i] !== null) {
                var flatObject = this.flattenObject(ob[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;
    
                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }

}