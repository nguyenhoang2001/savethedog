import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, PolygonCollider2D, RigidBody2D, Sprite } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Cat')
export class Cat extends Component {
    public body: RigidBody2D

    constructor() {
        super('cat')
    }

    start() {
        this.body = this.getComponent(RigidBody2D)
        this.body.sleep()
        this.body.enabledContactListener = false

        let collider = this.getComponent(CircleCollider2D)
        if(collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    private onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if (otherCollider.node.name == 'ground') {
            this.node.scene.emit('end')
        }
    }

    public killBody(): void {
        console.log('kill the cat !!!')
        this.body.sleep()
        this.body.enabledContactListener = false
    }

    public reviveBody(): void {
        this.body.wakeUp()
        this.body.enabledContactListener = true
    }

    update(deltaTime: number) {}
}
