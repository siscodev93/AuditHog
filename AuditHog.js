var AuditHog = (function(window, document, console){
    'use strict';
    var native = {'window':window, 'document': document, 'console':console};
    var CreateStackView = function(){

        var err = new Error();
        var stack = err.stack.split("\n");
        
        stack.shift(); //remove CreateStackView from Stack
        stack.shift(); //remove window.console from stack
        stack.shift(); //remove Object.error from stack
        
        var newstack = [];
        stack.forEach(function(arr){
            arr = arr.replace('    at ', '');
            newstack.push(arr);
        })
        return newstack;
    }
    
    var RelayToNativeConsole = function(type, data){
        native.console[type](data);  
    }
    var ProcessRuntimeError = function(msg, url, line, column, error){
        RelayToNativeConsole('warn', {type:'runtime', message:msg, file:url, line:line, stack:error});
        return false;
    }
    var ProcessLogDetails = function(type, message, stack){
        var org = stack[0].replace(window.location.origin,"").split(":");
        native.console.log(org);
        RelayToNativeConsole(type, {type:type, message:message, file:org[0], line:org[1], stack:stack});
    }
    
    //lets remove the windows console and substitue our own
    window.console = {
        log  :function( msg ){ ProcessLogDetails('log', msg, CreateStackView()) },
        warn :function( msg ){ ProcessLogDetails('warn', msg, CreateStackView()) },
        info :function( msg ){ ProcessLogDetails('info', msg, CreateStackView()) },
        error:function( msg ){ ProcessLogDetails('error', msg, CreateStackView()) },
    };
    
    window.onerror = ProcessRuntimeError;
    
    return {
        native,
        console,
    }
})(window, document, console);
