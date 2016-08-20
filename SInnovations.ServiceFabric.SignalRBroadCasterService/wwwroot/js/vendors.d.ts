declare interface Window {
    jQuery;
}

declare interface Object {
    assign<T, T1>(obj: T, obj1: T1): T | T1;
    assign(...args): any;
}

declare module "jQuery";

declare module "ajax" { }
declare module "signalr" {
    let s: SignalR;
    export = s;
}