window.onload = () =>
{
    new Application();
};

class Application
{
    private tileManager: TileManager;

    private static updateRate: number = 1 / 60;
    

    constructor()
    {
        this.init();
        
    }

    init()
    {
        var contentEl: HTMLElement = document.getElementById( "content" );

        var w = 900;
        var h = 450;
        var tileCountX = 25;
        var tileCountY = 13;

        this.tileManager = new TileManager();
        this.tileManager.createTileGrid( Math.floor( w / tileCountX ), new Vector2( tileCountX, tileCountY ), new Vector2( Math.floor( 0.5 * ( window.innerWidth - w ) ), Math.floor( 0.5 * ( window.innerHeight - h ) ) ) );
        //this.tileManager.createTileGrid( 200, 1, 1, 200, 200 );

        this.update();
    }

    update()
    {
        this.tileManager.update();
        //setTimeout( () => this.update(), Application.updateRate );

        requestAnimationFrame( ( time ) => this.update() );
    } 
}