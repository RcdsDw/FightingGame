class Sprite {
    constructor({ 
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0}
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 20
        this.offset = offset
    }

    draw() {
        if (this.isEnemy === true) {
            ctx.drawImage(
                this.image, 
                (this.framesMax - this.framesCurrent - 1) * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x - this.offset.x, 
                this.position.y - this.offset.y, 
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            )
        } else {
            ctx.drawImage(
                this.image, 
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x - this.offset.x, 
                this.position.y - this.offset.y, 
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            )
        }
    }

    animateFrame() {
        enemy.framesHold = 20
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrame()
    }
}

class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined},
        isEnemy = false
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height, 
        }
        this.isAttacking
        this.isAttack1Played = false
        this.health = 100
        this.isJumping
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12
        this.sprites = sprites
        this.dead = false
        this.isEnemy = isEnemy

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        if (!this.dead) {
            this.animateFrame()
        }

        // Attack Box

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // Draw AttackBox

        /* ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height) */

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x < 0) {
            this.position.x = 0
        } else if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width
        }

        // Gravity Function

        if (this.position.y + this.height + this.velocity.y >= canvas.height- 96) {
            this.velocity.y = 0
            this.position.y = 330
            this.isJumping = false
        } else {
            this.velocity.y += gravity
        }
    }

    jump() {
        if (this.isJumping === false) {
            this.isJumping = true
            this.velocity.y = -18
        }
    }
d
    attack() {
        if (!this.isAttack1Played) {
            this.switchSprite('attack1')
            this.isAttack1Played = true
        } else {
            this.switchSprite('attack2')
            this.isAttack1Played = false
        }
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 10

        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.framesMax -1) {
                this.dead = true
                return
            }
        }

        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax -1
            || this.image === this.sprites.attack2.image && this.framesCurrent < this.sprites.attack2.framesMax -1) 
        
        return
        
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax -1)
            
        return

        switch(sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'attack2':
                if (this.image !== this.sprites.attack2.image) {
                    this.image = this.sprites.attack2.image
                    this.framesMax = this.sprites.attack2.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}