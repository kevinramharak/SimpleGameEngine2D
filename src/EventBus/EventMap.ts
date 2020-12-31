import { Component } from '@/Component';
import { Entity } from '@/Entity';
import { IEvent } from './IEvent';

export type EventMap = {
    'Entity.Add': IEvent<'Entity.Add', { entity: Entity; }>;
    'Entity.Remove': IEvent<'Entity.Remove', { entity: Entity; }>;
    'Component.Add': IEvent<'Component.Add', { entity: Entity, component: Component }>;
    'Component.Remove': IEvent<'Component.Remove', { entity: Entity, component: Component }>;
};
