import { _decorator, BoxCollider2D, Component, find, instantiate, Node, NodePool, Prefab, RigidBody, RigidBody2D, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { Bee } from './Bee';
import { GameScene } from './GameScene';
const { ccclass, property } = _decorator;

@ccclass('BeeHive')
export class BeeHive extends Component {
    @property(Prefab)
    beePrefab: Prefab

    beePool: NodePool

    bees: Node[]

    start() {
        this.bees = []
        this.createBeePool()
    }

    update(deltaTime: number) {}

    private createBeePool(): void {
        this.beePool = new NodePool()
        
        const initCount = 10
        for (let i = 0; i < initCount; ++i) {
            let bee = instantiate(this.beePrefab) 

            this.tmpMakeActiveBee(bee)

            this.beePool.put(bee) 
        }
    }

    tmpMakeActiveBee(beeNode: Node) {
        this.node.addChild(beeNode)
    }

    spawnBee(parentNode:Node): Node {
        let node = null

        if (this.beePool.size() > 0) { 
            node = this.beePool.get()
        } else { 
            node = instantiate(this.beePrefab)
            this.tmpMakeActiveBee(node)
        }

        node.parent = parentNode
        node.getComponent(Bee).start()

        this.bees.push(node)

        return node
    }
}


