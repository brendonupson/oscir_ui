import { Class, ClassService, ConfigItemService } from "../core";
import { BehaviorSubject } from 'rxjs';
import { ConfigItem } from "../core/models/configitem.model";
import { Edge, Node } from '@swimlane/ngx-graph';
import { saveAs } from 'file-saver/dist/FileSaver';

export class ConfigItemMap {
    constructor(
        private configItem: ConfigItem,
        private configItemService: ConfigItemService,
        private classes: Class[]
    ) {
        this.mapSet.push(configItem);
        this.expand(false);
        this.refresh();
    }
    

    expandLevel = 0;
    mapSet: ConfigItem[] = []; //list of objects to map
    nodes = new BehaviorSubject([]);
    links = new BehaviorSubject([]);
    removedNodes: string[] = [];

    refresh() {
        this.setNodes();
        this.setLinks();
        //debugger;
    }


    reset() {
        this.mapSet = [];
    }

    expandNode(id: string) {        
        var node = this.getNode(id);
        if(!node) return;

        var ids = [];
        if (node.sourceRelationships) {
            node.sourceRelationships.forEach(rel => {
                if (!this.isInMap(rel.sourceConfigItemEntityId)) ids.push(rel.sourceConfigItemEntityId);
                if (!this.isInMap(rel.targetConfigItemEntityId)) ids.push(rel.targetConfigItemEntityId);
            });
        }
        // only add targets if the first level, or if we force expand
        if (node.targetRelationships) {
            node.targetRelationships.forEach(rel => {
                if (!this.isInMap(rel.sourceConfigItemEntityId)) ids.push(rel.sourceConfigItemEntityId);
                if (!this.isInMap(rel.targetConfigItemEntityId)) ids.push(rel.targetConfigItemEntityId);
            });
        }

        this.appendObjects(ids);
    }

    expand(shouldExpandTargetRelationships) {
        var ids = [];
        this.mapSet.forEach(ci => {
            if (ci.sourceRelationships) {
                ci.sourceRelationships.forEach(rel => {
                    if (!this.isInMap(rel.sourceConfigItemEntityId)) ids.push(rel.sourceConfigItemEntityId);
                    if (!this.isInMap(rel.targetConfigItemEntityId)) ids.push(rel.targetConfigItemEntityId);
                });
            }
            // only add targets if the first level, or if we force expand
            if ((shouldExpandTargetRelationships || this.expandLevel<1) && ci.targetRelationships) {
                ci.targetRelationships.forEach(rel => {
                    if (!this.isInMap(rel.sourceConfigItemEntityId)) ids.push(rel.sourceConfigItemEntityId);
                    if (!this.isInMap(rel.targetConfigItemEntityId)) ids.push(rel.targetConfigItemEntityId);
                });
            }
        });
        this.appendObjects(ids);
        this.expandLevel++;
    }

    isInMap(id: string) {
        var found = false;
        this.mapSet.forEach(ci => {
            if (ci.id == id) found = true;
        });
        return found;
    }

    getNode(id: string) {        
        for(var i=0; i<this.mapSet.length; i++)
        {
            var ci = this.mapSet[i];
            if (ci.id == id) return ci;
        }
        return null;
    }

    appendObjects(ids: string[]) {
        //call api and append to mapSet
        //remove dups
        this.configItemService.getSelected(ids)
            .subscribe(cis => {

                cis.forEach(ci => {
                    if(!this.isNodeRemoved(ci.id)) 
                    {
                        if(!this.nodesContains(ci.id)) this.mapSet.push(ci);
                    }
                });
                //console.log(this.mapSet);

                this.setNodes();
                this.setLinks();
            });
    }

    private setNodes() {
        var nodeSet: Node[] = [];

        this.mapSet.forEach(obj => {
            var node: Node = {
                id: obj.id,
                label: obj.name,                
                //tooltipTitle: this.getClassName(obj.classEntityId),                
                data: {
                    tooltipTitle: this.getClassName(obj.classEntityId),                    
                    fillColor: '#bbb'
                }
            };

            var color = this.getColorForClass(obj.classEntityId);
            if(color) node.data.fillColor = color;

            nodeSet.push(node);
        });
        //console.log(nodeSet);
        this.nodes.next(nodeSet);
    }

    private setLinks() {
        //assume setNodes is called first
        var linkSet = [];
        this.mapSet.forEach(obj => {

            if (obj.sourceRelationships) {
                obj.sourceRelationships.forEach(rel => {
                    var link: Edge = {
                        source: obj.id,
                        label: rel.relationshipDescription || '',
                        target: rel.targetConfigItemEntityId
                    }
                    //ensure no stray broken relationships
                    if (this.nodesContains(link.source) && this.nodesContains(link.target)) linkSet.push(link);
                });
            }
/*
//not required
            if (obj.targetRelationships) {
                obj.targetRelationships.forEach(rel => {
                    var link: NgxMapLink = {
                        source: rel.sourceConfigItemEntityId,
                        label: rel.relationshipDescription || '',
                        target: obj.id
                    }
                    //ensure no stray broken relationships
                    if (this.nodesContains(link.source) && this.nodesContains(link.target)) linkSet.push(link);
                });
            }*/
        });
        //console.log(linkSet);
        this.links.next(linkSet);
    }

    getClassName(classEntityId) 
    {        
        for(var i=0; i<this.classes.length; i++)
        {
            var classObj = this.classes[i];
            //debugger;
            if (classObj.id == classEntityId) 
            {
                return classObj.className;                
            }
        }
        return '';
    }

    getColorForClass(classEntityId) 
    {        
        for(var i=0; i<this.classes.length; i++)
        {
            var classObj = this.classes[i];
            if (classObj.id == classEntityId) 
            {
                return classObj.colorCode;                
            }
        }
        return '';
    }

    nodesContains(id) {       
        for(var i=0; i<this.mapSet.length; i++)
        {
            var obj = this.mapSet[i];
            if (obj.id == id) return true;
        }
        return false;
    }

    isNodeRemoved(id)
    {
        for(var i=0; i<this.removedNodes.length; i++)
        {            
            if (this.removedNodes[i] == id) return true;
        }
        return false;
    }

    removeNode(id)
    {
        //alert('remove: '+id);
        for(var i=0; i<this.mapSet.length; i++)
        {
            var obj = this.mapSet[i];
            if (obj.id == id)
            {                
                this.mapSet.splice(i, 1);  
                this.removedNodes.push(id);              
                this.refresh();
                break;
            }
        }        
    }

}