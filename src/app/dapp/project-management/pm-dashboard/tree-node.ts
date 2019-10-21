import { Component, Input } from '@angular/core';

@Component({
    selector: 'node-tree',
     template: `
       <ng-container *ngTemplateOutlet="tree;context:{node:node}">
       </ng-container>
  
       <ng-template #tree let-node="node">
         <div>{{node.name}}</div>
         <ul *ngIf="node.children && node.children.length > 0">
           <ng-container *ngFor="let child of node.children">
             <li>
               <ng-container *ngTemplateOutlet="tree;context:{node:child}">
               </ng-container>
             </li>
           </ng-container>
         </ul>
       </ng-template>
     `
  })
  export class NodeTree {
      @Input() node;
  }