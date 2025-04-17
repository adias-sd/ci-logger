export function throttle (callbackFn: Function, limit: number, ...extraArgs: any) {
    let wait = false;
    return function (args: any) {              
        if (!wait) {
            callbackFn.call(args);           
            wait = true;               
            setTimeout(function () {   
                wait = false;          
            }, limit);
        }
    }
}