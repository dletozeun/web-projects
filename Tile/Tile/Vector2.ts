class Vector2
{
    constructor(
        public x: number = 0,
        public y: number = 0 )
    {
    }

    get length(): number
    {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    }

    get sqrLength(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    add( v: Vector2 ): void
    {
        this.x += v.x;
        this.y += v.y;
    }

    substract( v: Vector2 ): void
    {
        this.x -= v.x;
        this.y -= v.y;
    }

    distanceTo( v: Vector2 ): number
    {
        return new Vector2( this.x - v.x, this.y - v.y ).length;
    }

    toString(): string
    {
        return "( " + this.x + ", " + this.y + " )";
    }

    static add( a: Vector2, b: Vector2 ): Vector2
    {
        return new Vector2( a.x + b.x, a.y + b.y );
    }

    static substract( a: Vector2, b: Vector2 ): Vector2
    {
        return new Vector2( a.x - b.x, a.y - b.y );
    }

    static distance( a: Vector2, b: Vector2 ): number
    {
        return Vector2.substract( a, b ).length;
    }

    static sqrDistance( a: Vector2, b: Vector2 ): number
    {
        return Vector2.substract( a, b ).sqrLength;
    }
}
