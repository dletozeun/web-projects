class EventUtil
{
    constructor()
    {
    }

    static addHandler( element: any, type: string, handler: any )
    {
        if( element.addEventListener )
        {
            element.addEventListener( type, handler, false );
        }
        else if( element.attachEvent )
        {
            element.attachEvent( "on" + type, handler );
        }
        else
        {
            element[ "on" + type ] = handler;
        }
    }

    static removeHandler( element: any, type: string, handler: any )
    {
        if( element.removeEventListener )
        {
            element.removeEventListener( type, handler, false );
        }
        else if ( element.detachEvent )
        {
            element.detachEvent( "on" + type, handler );
        }
        else
        {
            element[ "on" + type ] = null;
        }
    }

    static getEvent( event: Event ): Event
    {
        return event ? event : window.event;
    }

    getTarget( event: Event ): EventTarget
    {
        return event.target || event.srcElement;
    }

    preventDefault( event: Event )
    {
        if ( event.preventDefault )
        {
            event.preventDefault();
        }
        else if( event instanceof MSEventObj )
        {
            (<MSEventObj>event).returnValue = false;
        }
    }

    stopPropagation( event: Event )
    {
        if ( event.stopPropagation )
        {
            event.stopPropagation();
        }
        else
        {
            event.cancelBubble = true;
        }
    }

    getCharCode( event: Event ): number
    {
        if ( event instanceof KeyboardEvent )
        {
            var kbdEvent: KeyboardEvent = <KeyboardEvent>event;
            if ( typeof kbdEvent.charCode == "number" )
            {
                return kbdEvent.charCode;
            }
            else
            {
                return kbdEvent.keyCode;
            }
        }

        return -1;
    }
}
