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
        this.reset()
    }

    reset() {
        this.graphics = null
        this.draw = false
    }
}

class RendererSystem extends ECSY.System {
    execute(dt, t) {
        this.queries.circles.results.forEach(entity => {
            const props = entity.getComponent(Circle)
            const go = entity.getMutableComponent(GraphicsGameObject)

            const { x, y } = props.position
            if (!go.draw) {
                // NOTE: draw circle every time this system execute cause make
                // frame rate drop due to unnescessary call requestAnimationFrame.
                go.graphics
                    .fillCircle(x, y, props.radius)
                    .fillStyle(props.color, props.alpha)
                go.draw = true
            }
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
                },
                debug: true,
            },
            default: "arcade",
        }
    })
}

run()
