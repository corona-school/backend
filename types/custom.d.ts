declare module '@onlabsorg/swan-js' {
    declare function parse(condition: any): (context: any) => Promise<any>;
    export { parse };
}
