class Color
{
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0 )
    {
    }

    toHex(): string
    {
        return this.r.toString( 16 ) + this.g.toString( 16 ) + this.b.toString( 16 );
    }

    toHTMLColor(): string
    {
        return "#" + this.toHex();
    }

    static lerp( c1: Color, c2: Color, f: number ): Color
    {
        return new Color( Math.floor( ( 1 - f ) * c1.r + f * c2.r ),
                          Math.floor( ( 1 - f ) * c1.g + f * c2.g ),
                          Math.floor( ( 1 - f ) * c1.b + f * c2.b ) );
    }
} 
