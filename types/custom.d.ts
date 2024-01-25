declare module '@onlabsorg/swan-js' {
    declare function parse(condition: any): (context: any) => Promise<boolean>;
    export { parse };
}
