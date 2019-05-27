import { Class, ClassService, ConfigItemService } from "../core";
import { NgxMapNode, NgxMapLink } from "../core/models/ngxMap.model";
import { BehaviorSubject } from 'rxjs';
import { ConfigItem } from "../core/models/configitem.model";


export class ConfigItemMap {
    constructor(
        private configItem: ConfigItem,
        private configItemService: ConfigItemService,
        private classes: Class[]
    ) {
        this.mapSet.push(configItem);
        this.expand();
        this.refresh();
    }


    mapSet: ConfigItem[] = []; //list of objects to map
    nodes = new BehaviorSubject([]);
    links = new BehaviorSubject([]);

    refresh() {
        this.setNodes();
        this.setLinks();
        //debugger;
    }


    reset() {
        this.mapSet = [];
    }

    expand() {
        var ids = [];
        this.mapSet.forEach(ci => {
            if (ci.sourceRelationships) {
                ci.sourceRelationships.forEach(rel => {
                    if (!this.isInMap(rel.sourceConfigItemEntityId)) ids.push(rel.sourceConfigItemEntityId);
                    if (!this.isInMap(rel.targetConfigItemEntityId)) ids.push(rel.targetConfigItemEntityId);
                });
            }

            if (ci.targetRelationships) {
                ci.targetRelationships.forEach(rel => {
                    if (!this.isInMap(rel.sourceConfigItemEntityId)) ids.push(rel.sourceConfigItemEntityId);
                    if (!this.isInMap(rel.targetConfigItemEntityId)) ids.push(rel.targetConfigItemEntityId);
                });
            }
        });
        this.appendObjects(ids);
    }

    isInMap(id: string) {
        var found = false;
        this.mapSet.forEach(ci => {
            if (ci.id == id) found = true;
        });
        return found;
    }

    appendObjects(ids: string[]) {
        //call api and append to mapSet
        //remove dups
        this.configItemService.getSelected(ids)
            .subscribe(cis => {

                cis.forEach(ci => {
                    this.mapSet.push(ci);
                });
                //console.log(this.mapSet);

                this.setNodes();
                this.setLinks();
            });
    }

    private setNodes() {
        var nodeSet: NgxMapNode[] = [];

        this.mapSet.forEach(obj => {
            var node: NgxMapNode = {
                id: obj.id,
                label: obj.name,
                tooltipTitle: this.getClassName(obj.classEntityId),
                position: null,
                dimension: null
            };

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
                    var link: NgxMapLink = {
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

    nodesContains(id) {
        /*var found = false;
        this.mapSet.forEach(obj => {
            //debugger;
            if (obj.id == id) found = true;
        });
        return found;*/
        for(var i=0; i<this.mapSet.length; i++)
        {
            var obj = this.mapSet[i];
            if (obj.id == id) return true;
        }
        return false;
    }

}