export const W = 'w'
export const A = 'a'
export const S = 's'
export const D = 'd'
export const SHIFT = 'shift'
export const DIRECTIONS = [W, A, S, D]

export class KeyDisplay {

    map: Map<string, HTMLButtonElement> = new Map()

    constructor() {
        const w: HTMLButtonElement = document.createElement("button")
        const a: HTMLButtonElement = document.createElement("button")
        const s: HTMLButtonElement = document.createElement("button")
        const d: HTMLButtonElement = document.createElement("button")
        const shift: HTMLButtonElement = document.createElement("button")

        this.map.set(W, w)
        this.map.set(A, a)
        this.map.set(S, s)
        this.map.set(D, d)
        this.map.set(SHIFT, shift)

        this.map.forEach((v, k) => {
            v.style.color = 'blue'
            v.style.fontSize = '10px'
            v.style.fontWeight = '800'
            v.style.position = 'absolute'
            v.textContent = k
            v.style.padding = '5px 10px'
            v.style.border = '1px solid black'
            v.style.borderRadius = '5px'
            v.style.backgroundColor = 'white'
            v.style.cursor = 'pointer'
        })

        this.updatePosition()

        this.map.forEach((v, _) => {
            document.body.append(v)
        })
    }

    public updatePosition() {
        this.map.get(W).style.top = `${window.innerHeight - 125}px`
        this.map.get(A).style.top = `${window.innerHeight - 100}px`
        this.map.get(S).style.top = `${window.innerHeight - 100}px`
        this.map.get(D).style.top = `${window.innerHeight - 100}px`
        this.map.get(SHIFT).style.top = `${window.innerHeight - 100}px`

        this.map.get(W).style.left = `${130}px`
        this.map.get(A).style.left = `${100}px`
        this.map.get(S).style.left = `${130}px`
        this.map.get(D).style.left = `${160}px`
        this.map.get(SHIFT).style.left = `${50}px`
    }

    public down (key: string) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.color = 'red'
        }
    }

    public up (key: string) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.color = 'blue'
        }
    }

}