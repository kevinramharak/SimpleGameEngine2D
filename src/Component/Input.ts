import { Maybe } from '@/types';
import { Component } from './Component';

interface IAction {

}

export class Input extends Component {
    actions: IAction[] = [];

    AddAction(action: IAction) {
        this.actions.push(action);
    }

    RemoveAction(action: IAction): Maybe<IAction> {
        const index = this.actions.indexOf(action);
        if (index !== -1) {
            return this.actions.splice(index, 1);
        }
    }
}
