import { Class, ClassService } from "../core";
import { NgxMapNode, NgxMapLink } from "../core/models/ngxMap.model";
import { Observable } from "rxjs";
import { BehaviorSubject } from 'rxjs';


export class BlueprintMap {
    constructor(
        private classService: ClassService
    ) {
        this.refresh();
    }


    mapSet: Class[] = []; //list of objects to map
    nodes = new BehaviorSubject([]);
    links = new BehaviorSubject([]);

    refresh() {
        this.classService.getAll()
            .subscribe(classes => {
                var instantiableClasses = classes.filter(function (filterClass: Class) {
                    return filterClass.isInstantiable;
                });

                var lookupClassEntityIds = [];
                instantiableClasses.forEach(classObj => {
                    lookupClassEntityIds.push(classObj.id);
                });

                //console.log(lookupClassEntityIds);
                this.classService.getSelected(lookupClassEntityIds)
                    .subscribe(classes => {
                        this.mapSet = classes;
                        //console.log(this.mapSet);

                        this.setNodes();
                        this.setLinks();
                    });

            });
    }


    reset() {
        this.mapSet = [];
    }



    private setNodes() {
        var nodeSet: NgxMapNode[] = [];
        this.mapSet.forEach(obj => {
            var node: NgxMapNode = {
                id: obj.id,
                label: obj.className,
                position: null,
                dimension: null
            };

            nodeSet.push(node);
        });
        console.log(nodeSet);
        this.nodes.next(nodeSet);
    }

    private setLinks() {
        var linkSet = [];
        this.mapSet.forEach(obj => {

            if (obj.sourceRelationships) {
                obj.sourceRelationships.forEach(rel => {
                    var link: NgxMapLink = {
                        source: obj.id,
                        label: rel.relationshipDescription,
                        target: rel.targetClassEntityId
                    }

                    linkSet.push(link);
                });
            }

            if (obj.targetRelationships) {
                obj.targetRelationships.forEach(rel => {
                    var link: NgxMapLink = {
                        source: rel.sourceClassEntityId,
                        label: rel.relationshipDescription,
                        target: obj.id
                    }

                    linkSet.push(link);
                });
            }
        });

        this.links.next(linkSet);
    }

}