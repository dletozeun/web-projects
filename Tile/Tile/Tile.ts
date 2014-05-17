class Tile
{
    private domElement: any;

    get Center(): Vector2
    {
        return new Vector2( this.position.x + 0.5 * this.size.x, this.position.y + 0.5 * this.size.y );
    }

    get DomElement(): any
    {
        return this.domElement;
    }

    get Size(): Vector2
    {
        return this.size;
    }

    constructor(
        private position: Vector2,
        private size: Vector2,
        private color: string,

        parentElement: HTMLElement,
        text: string )
    {
        this.domElement = document.createElement( "div" );
        this.domElement.className = "tile";
        this.domElement.style.width = size.x + "px";
        this.domElement.style.height = size.y + "px";
        this.domElement.style.left = position.x + "px";
        this.domElement.style.top = position.y + "px";
        this.domElement.style.paddingLeft = Math.floor( 0.1 * size.x ) + "px";
        this.domElement.style.paddingTop = "0px";
        this.domElement.style.fontSize = Math.floor( 0.8 * size.x ) + "px";

        this.generateColor();

        this.domElement.textContent = text;

        parentElement.appendChild( this.domElement );
    }

    generateColor()
    {
        //var c = Math.floor( 200 + 20 * ( Math.random() - 0.5 ) );
        //this.domElement.style.backgroundColor = new Color( c, c, c ).toHTMLColor();

        this.domElement.style.backgroundColor = new Color( Math.floor( 170 + 20 * ( Math.random() - 0.5 ) ),
            Math.floor( 204 + 20 * ( Math.random() - 0.5 ) ),
            Math.floor( 204 + 20 * ( Math.random() - 0.5 ) ) ).toHTMLColor();
    }

    update( mousePos: Vector2 )
    {
        var center = this.Center;
        var delta = Vector2.substract( mousePos, center );

        var angleAmp = 30;
        var angleX = 0;
        var angleY = 0;
        var extent = new Vector2( 7 * this.size.x, 7 * this.size.y );
        var amp = new Vector2( Math.max( ( extent.x - Math.abs( delta.x ) ) / extent.x, 0 ),
                                        Math.max( ( extent.y - Math.abs( delta.y ) ) / extent.y, 0 ) );

        angleX = this.getAngle( delta.y, extent.y, angleAmp * amp.x );
        angleY = -this.getAngle( delta.x, extent.x, angleAmp * amp.y );

        //var c1: Color = new Color( 170, 204, 204 );
        //var c2: Color = new Color( 153, 170, 170 );

        //this.domElement.style.backgroundColor = Color.lerp( c1, c2, ( Math.abs( angleX ) + Math.abs( angleY ) ) / ( 2 * 35 ) ).toHTMLColor();
        //this.domElement.textContent = Color.lerp( c1, c2, ( Math.abs( angleX ) + Math.abs( angleY ) ) / ( 2 * 35 ) ).toHTMLColor();

        var transformStyle = "perspective(600px) rotateX(" + angleX + "deg) rotateY(" + angleY + "deg)";
        this.domElement.style.webkitTransform = transformStyle;
        this.domElement.style.transform = transformStyle;

        if( Math.abs( angleX ) >= 0.1 || Math.abs( angleY ) >= 0.1 )
        {
            var hShadow = -Math.floor( 5 * ( angleY / angleAmp ) );
            var vShadow = Math.floor( 5 * ( angleX / angleAmp ) );
            var changeFactor = ( 0.5 * ( Math.abs( angleX ) + Math.abs( angleY ) ) ) / angleAmp;
            var blur = Math.abs( Math.floor( 10 * changeFactor  ) );

            var shadowStyle = hShadow + "px " + vShadow + "px " + blur + "px 0px #777";
            this.domElement.style.boxShadow = shadowStyle;

            this.domElement.style.width = Math.floor( ( 1 - changeFactor ) * this.size.x + changeFactor * 0.92 * this.size.x ) + "px";
            this.domElement.style.height = Math.floor( ( 1 - changeFactor ) * this.size.y + changeFactor * 0.92 * this.size.y ) + "px";

            //this.domElement.style.backgroundColor = "#a0c0c0";
        }
        else
        {
            this.domElement.style.boxShadow = "";
            this.domElement.style.width = this.size.x + "px";
            this.domElement.style.height = this.size.y + "px";
            //this.domElement.style.backgroundColor = "#aacccc";
        }
    }

    private getAngle( x: number, extent: number, amplitude: number ): number
    {
        var xnorm: number = Math.abs( x );

        if ( xnorm > extent )
        {
            return 0;
        }

        if ( xnorm <= 0.5 * extent )
        {
            return ( amplitude / ( 0.5 * extent ) ) * x;
        }

        return ( x < 0 ? -1 : 1 ) * 2 * amplitude * ( -xnorm / extent + 1 );
    }
} 