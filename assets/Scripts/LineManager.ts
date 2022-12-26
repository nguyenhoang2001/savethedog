import {
    _decorator,
    CircleCollider2D,
    Component,
    Graphics,
    math,
    RigidBody2D,
    Vec2,
    Vec3,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('LineManager')
export class LineManager extends Component {
    graphics: Graphics
    body: RigidBody2D

    points: Vec2[]

    start() {
        this.graphics = this.getComponent(Graphics)
        this.body = this.getComponent(RigidBody2D)

        this.body.sleep()

        const g = this.getComponent(Graphics)
        g.lineWidth = 10
        g.fillColor.fromHEX('#ff0000')
    }

    update(deltaTime: number) {}

    public beginDraw(point: Vec2): void {
        const localPoint = new Vec3()
        this.node.inverseTransformPoint(localPoint, new Vec3(point.x, point.y))
        const { x, y } = localPoint
        this.graphics.moveTo(x, y)

        this.points = []
        this.points.push(new Vec2(x,y))
    }

    public drawTo(point: Vec2): void {
        const localPoint = new Vec3()

        this.node.inverseTransformPoint(localPoint, new Vec3(point.x, point.y))
        const { x, y } = localPoint
        this.graphics.lineTo(x, y)
        this.graphics.stroke()

        this.points.push(new Vec2(x,y))
    }

    private getPoints(dis:number, point:Vec2, nxtPoint: Vec2) {

        const divideTo = Math.round(dis/10)
        const points:Vec2 [] = []

        for (let i = divideTo - 1; i >= 0; i--) {
            const x = (1 - i / divideTo) * point.x + (i / divideTo) * nxtPoint.x
            const y = (1 - i / divideTo) * point.y + (i / divideTo) * nxtPoint.y

            points.push(new Vec2(x,y))
        }
        return points
    }

    public endDraw(): void {
        this.body.wakeUp()

        for(let i = 0; i < this.points.length - 1; i++) {
            const point = this.points[i]
            const prePoint = this.points[i + 1]

            const dis = math.Vec2.distance(point,prePoint) 

            const points = [point]

            if(dis >= 5) {
                const insidePoints = this.getPoints(dis,point, prePoint)
                points.push(...insidePoints)

                points.forEach((point)=>{
                    const collider = this.addComponent(CircleCollider2D)
                    collider.offset.set(point.x,point.y)
                    collider.radius = 5
                    collider.apply()
                })
            }
        }
    }
}
