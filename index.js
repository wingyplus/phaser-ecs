class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
}

class Circle extends ECSY.Component {
    constructor() {
        super()
        this.position = new Vector2()
        this.radius = 0
        this.color = 0xFFFFFF
        this.alpha = 1
    }

    reset() {
        this.position = null;
        this.radius = 0;
    }
}

class GraphicsGameObject extends ECSY.Component {
    constructor() {
        super()
        this.graphics = null;
    }

    reset() {
        this.graphics = null;
    }
}

class RendererSystem extends ECSY.System {
    execute(dt, t) {
        this.queries.circles.results.forEach(entity => {
            const props = entity.getComponent(Circle)
            const go = entity.getComponent(GraphicsGameObject)

            const { x, y } = props.position
            go.graphics.fillCircle(x, y, props.radius)
            go.graphics.fillStyle(props.color, props.alpha)
        })
    }
}

RendererSystem.queries = {
    circles: {
        components: [Circle, GraphicsGameObject]
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super("Main")
        this.world = new ECSY.World()
    }

    create() {
        this.world
            .registerComponent(Circle)
            .registerComponent(GraphicsGameObject)
            .registerSystem(RendererSystem)

        for (let i = 0; i < 100; i++) {
            this.world
                .createEntity()
                .addComponent(Circle, { position: randomPosition(), radius: 10, color: 0xFF00FF })
                .addComponent(GraphicsGameObject, {
                    graphics: this.add.graphics()
                })
        }
    }

    update(t, dt) {
        this.world.execute(dt, t)
    }
}

const randomPosition = () => new Vector2(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600))

const run = () => {
    return new Phaser.Game({
        type: Phaser.WEBGL,
        parent: "main",
        width: 800,
        height: 600,
        scene: [new MainScene()],
        scale: {
            mode: Phaser.Scale.FIT,
        },
        physics: {
            arcade: {
                gravity: {
                    y: 10,
                }
            },
            default: "arcade",
        }
    })
}

run()
