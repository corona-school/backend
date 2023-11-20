declare module '@onlabsorg/swan-js' {
    declare function parse(condition: string): (context: any) => boolean;
    export { parse };
}
