import {
    _decorator,

    BoxCollider2D,

    CircleCollider2D,

    Component,

    EPhysics2DDrawFlags,

    EventTouch,

    Input,
    input,

    math,
    Node,

    PhysicsSystem2D,
    Vec3,

} from 'cc'
import { Cat } from './Cat'
import { LineManager } from './LineManager'
import { Bee } from './Bee'
import { BeeHive } from './BeeHive'
const { ccclass, property } = _decorator

enum gameState {
    ready,
    drawing,
    start,
    end,
}

@ccclass('GameScene')
export class GameScene extends Component {
    @property(LineManager)
    line: LineManager

    @property(Node)
    ground: Node

    @property(Cat)
    cat: Cat

    @property(BeeHive)
    beeHive1: BeeHive

    @property(BeeHive)
    beeHive2: BeeHive

    public state: gameState

    hives: BeeHive[]

    start() {
        // this.enablePhysicsDebug()

        PhysicsSystem2D.instance.enable = true

        this.state = gameState.ready

        this.hives = [this.beeHive1, this.beeHive2]

        this.setUpInputEvents()

        this.node.scene.on('end',this.endGame,this)
    }

    enablePhysicsDebug() {
        PhysicsSystem2D.instance.debugDrawFlags = PhysicsSystem2D.instance.debugDrawFlags =
            EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape
    }

    update(deltaTime: number) {
        if (this.state === gameState.start) {}
    }

    private setUpInputEvents(): void {
        input.on(
            Input.EventType.TOUCH_MOVE,
            (event: EventTouch) => {
                if (this.state === gameState.start || this.state === gameState.end) {
                    return
                }
                this.state = gameState.drawing
                this.drawLine(event)
            },
            this
        )

        input.on(
            Input.EventType.TOUCH_END,
            () => {
                if (this.state === gameState.drawing) {
                    this.state = gameState.start
                    this.ground.name = 'ground'
                    this.cat.reviveBody()
                    this.startGame()
                }
            },
            this
        )

        input.on(
            Input.EventType.TOUCH_START,
            (event: EventTouch) => {
                if (this.state === gameState.ready) {
                    this.line.beginDraw(event.touch.getUILocation())
                }
            },
            this
        )
    }

    private drawLine(event: EventTouch): void {
        const touch = event.touch
        const point = touch.getUILocation()
        this.line.drawTo(point)
    }

    private startGame(): void {
        this.cat?.body.wakeUp()
        this.hives.forEach((hive:BeeHive)=> {
            this.spawnBees(hive)
        })
        this.line.endDraw()
    }

    private spawnBees(hive:BeeHive): void {
        let delay = 0.4

        for(let i = 0; i < 10; i++) {
            const beeNode = hive.spawnBee(this.node)
            const beeCollider =  beeNode.getComponent(CircleCollider2D)
            const bee = beeNode.getComponent(Bee)

            bee.node.active = false
            
            beeCollider.apply()

            this.scheduleOnce(()=>{
                bee.node.active = true
                bee.setUpCallBackWhenFlying()
            }, delay)
            delay += 0.2
        }
    }

    public endGame(): void {
        this.state = gameState.end
        this.cat.killBody()
    }
}
