import { _decorator, BoxCollider2D, CircleCollider2D, Collider2D, Component, Contact2DType, find, IPhysics2DContact, macro, math, Node, RigidBody, RigidBody2D, Sprite, SpriteComponent, SpriteFrame, toDegree, v2, Vec2, Vec3, Vec4, VerticalTextAlignment } from 'cc'
import { GameScene } from './GameScene'
const { ccclass, property } = _decorator

@ccclass('Bee')
export class Bee extends Component {
    body: RigidBody2D
    collider: CircleCollider2D
    gameScene: GameScene
    isTouchCat: boolean

    constructor() {
        super('bee')
    }

    start() {
        this.body = this.getComponent(RigidBody2D)
        this.collider = this.getComponent(CircleCollider2D)
        this.gameScene = find('Canvas/game-scene').getComponent(GameScene)

        this.body.gravityScale = 0.5

        this.isTouchCat = false

        let collider = this.getComponent(BoxCollider2D)
        if(collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    private onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.node.name == 'cat') {
            this.isTouchCat = true
            this.node.scene.emit('end')
        }
    }

    update(deltaTime: number) {}

    public flyTo(point:Vec2): void {
        const pos = new Vec3()
        this.node.inverseTransformPoint(pos, new Vec3(point.x, point.y))

        // this.body.linearVelocity = new Vec2(pos.x * 0.05 , pos.y *0.05)

        this.body.applyForceToCenter(new Vec2(pos.x, pos.y), true)
    }

    public setUpCallBackWhenFlying(): void {
        this.schedule(()=>{
            const catPos = this.gameScene.cat.node.worldPosition
            this.flyTo(new Vec2(catPos.x, catPos.y)) 
        },0.5,macro.REPEAT_FOREVER)
    }
}
