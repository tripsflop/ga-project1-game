// x and y coordinates for the mobs to turn
const waypoints = [
  {
    x: -98.6489384516406,
    y: 461.076560154407,
  },
  {
    x: 347.415826720995,
    y: 461.076560154407,
  },
  {
    x: 347.415826720995,
    y: 268.067767531632,
  },
  {
    x: 677.675316319966,
    y: 268.067767531632,
  },
  {
    x: 681.964400600472,
    y: 594.038172850097,
  },
  {
    x: 995.067553077418,
    y: 589.74908856959,
  },
  {
    x: 999.356637357924,
    y: 274.501393952391,
  },
  {
    x: 1404.67510186575,
    y: 270.212309671885,
  },
];

// 0 represent no tile, 14 represent tile
// placement length is 240 => 20 columns, 12 rows
// convert to 2d array
const placement = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 14, 0, 14, 0,
  0, 0, 0, 14, 0, 14, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 14, 0, 0, 0, 0, 14, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0,
  0, 14, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 14, 0, 0, 0, 0, 0, 14, 0, 14, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// placement converted to 2d array
const placement2D = [];

const tileSize = 64;

for (let x = 0; x < placement.length; x += 20) {
  let temp = [];
  for (let i = 0; i < 20; i++) {
    temp.push(placement[i + x]);
  }
  placement2D.push(temp);
}

class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = tileSize; // each tile is 64x64
    this.color = "rgba(225,255,255,0.1)";
    this.isOccupied = false;
  }
  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(mouse) {
    this.draw();
    // left and right hand side of the tile, only detect if in between
    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      this.color = "rgba(0,255,120,0.25)";
    } else {
      this.color = "rgba(225,255,255,0.1)";
    }
  }
}
const placementTiles = [];
// draw tiles
placement2D.forEach((row, y) => {
  row.forEach((tile, x) => {
    if (tile === 14) {
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * tileSize,
            y: y * tileSize,
          },
        })
      );
    }
  });
});

const building = [];
let activeTile = undefined;

class Sprite {
  constructor({
    position = { x: 0, y: 0 },
    imgSrc,
    frames = { max: 1 },
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imgSrc;
    this.frames = {
      max: frames.max,
      current: 0,
      elapsed: 0,
      hold: 10,
    };
    this.offset = offset;
  }

  draw() {
    const cropWidth = this.image.width / this.frames.max;
    // determine the dimension where we want to crop our spritesheet
    const crop = {
      position: {
        x: cropWidth * this.frames.current,
        y: 0,
      },
      width: cropWidth,
      height: this.image.height,
    };

    // crop the horizontal sprite sheet based on the calculated width and height
    context.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      crop.width,
      crop.height
    );
  }

  update() {
    // to hold the frame, prevent it from cycling through the sprite sheet too quickly
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold == 0) {
      this.frames.current++;
      if (this.frames.current >= this.frames.max) {
        this.frames.current = 0;
      }
    }
  }
}

let projectileSpeed = 3;

class Building extends Sprite {
  constructor({ position = { x: 0, y: 0 } }, attackSpeed) {
    super({
      position,
      imgSrc: "images/tower.png",
      frames: {
        max: 19,
      },
      offset: {
        x: 0,
        y: -tileSize,
      },
    });
    this.width = tileSize * 2;
    this.height = tileSize;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.projectiles = [];
    // attack range of building
    this.radius = 250;
    this.target = null;
    this.frames.hold = attackSpeed;
  }

  draw() {
    super.draw();
  }

  update() {
    this.draw();
    // only shoot if targets come into range
    // resets back to original position if not in use
    if (this.target || (!this.target && this.frames.current !== 0)) {
      super.update();
    }

    // throw projectile on the 6th frame
    if (
      this.target &&
      this.frames.current === 6 &&
      this.frames.elapsed % this.frames.hold == 0
    ) {
      this.shoot();
    }
  }

  // offset to make it look like the projectile was thrown off the top
  shoot() {
    this.projectiles.push(
      new Projectile({
        position: { x: this.center.x - 20, y: this.center.y - 100 },
        enemy: this.target,
      })
    );
  }
}

// projectile needs to be able to "lock-on" to an enemy
class Projectile extends Sprite {
  constructor({ position = { x: 0, y: 0 }, enemy }) {
    super({ position, imgSrc: "images/projectile.png" });
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 10;
    // projectile travel speed
    this.speed = 4;
  }

  // make projectile follow a path to the enemy
  update() {
    this.draw();
    const angle = Math.atan2(
      this.enemy.center.y - this.position.y,
      this.enemy.center.x - this.position.x
    );

    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// standard stuff
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// set width and height of canvas to be same as map
canvas.width = 1280;
canvas.height = 768;

// enemy class
class Enemy extends Sprite {
  constructor({ position = { x: 0, y: 0 } }, src, hitpoint, speed) {
    super({ position, imgSrc: src, frames: { max: 7 } });
    this.width = 100;
    this.height = 100;
    this.waypointIndex = 0;
    // make the enemy move along the center of the path
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.radius = 50;
    this.health = hitpoint;
    this.maxHealth = hitpoint;
    this.speed = speed;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    super.draw();
    // draw enemy HP
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y - 15, this.width, 10);
    // overlapping green health bar over red health bar
    // when enemies get hit, green health bar decreases, revealing the red health bar
    context.fillStyle = "green";
    context.fillRect(
      this.position.x,
      this.position.y - 15,
      this.width * (this.health / this.maxHealth),
      10
    );
  }

  update() {
    this.draw();
    super.update();
    // find x and y velocity of our enemies
    // move enemies from one waypoint to another
    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // keep enemies centered along the path
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    // check if reach a waypoint, go to the next
    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
        Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
        Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}

const enemies = [];
let hitpoint = 80;
let speed = 1;
let bossMultiplier = 1;
const bossLevels = 5;
let level = 1;

// waves of enemies
function spawnEnemies(count) {
  for (let i = 1; i <= count; i++) {
    if (count % bossLevels == 0 && count != bossLevels) {
      continue;
    }
    // space out the enemies
    const xOffset = i * 150;
    enemies.push(
      new Enemy(
        {
          position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
        },
        `/images/sprite${Math.trunc(Math.random() * 6)}.png`,
        hitpoint,
        speed
      )
    );
  }
  if (count % bossLevels == 0 && count != bossLevels) {
    enemies.push(
      new Enemy(
        {
          position: { x: waypoints[0].x, y: waypoints[0].y },
        },
        `/images/boss${Math.trunc(Math.random() * 3)}.png`,
        hitpoint + 3000 * bossMultiplier,
        0.8
      )
    );
    bossMultiplier++;
  }
  hitpoint += 40;
  speed += 0.03;
}

let enemyCount = 5;
let hearts = 10;
spawnEnemies(enemyCount);

let coins = 100;
const explosions = [];
let damage = 20;
const maxLevel = 50;

const powerBtn = document.querySelector("#power");
const speedBtn = document.querySelector("#speed");
let powerUpCost = 50;
let speedUpCost = 1000;
let attackSpeed = 10;

powerBtn.addEventListener("click", () => {
  if (coins - powerUpCost >= 0) {
    damage += 10;
    coins -= powerUpCost;
    powerUpCost += 50;
    document.querySelector("#coin").innerHTML = coins;
    document.querySelector("#power").innerHTML = `PWR UP - ${powerUpCost}G`;
  }
});

speedBtn.addEventListener("click", () => {
  if (coins - speedUpCost >= 0 && attackSpeed > 1) {
    attackSpeed--;
    for (let tower of building) {
      tower.frames.hold = attackSpeed;
    }
    coins -= speedUpCost;
    speedUpCost += 1000;
    document.querySelector("#coin").innerHTML = coins;
    document.querySelector("#speed").innerHTML = `SPD UP - ${speedUpCost}G`;
  }

  if (attackSpeed === 1) {
    document.querySelector("#speed").innerHTML = `FULLY UPGRADED`;
  }
});

function animate() {
  const animationId = requestAnimationFrame(animate);
  context.drawImage(image, 0, 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();
    // if enemy goes off the map, decrease heart
    if (enemy.position.x > canvas.width) {
      hearts -= 1;
      document.querySelector("#heart").innerHTML = hearts;
      enemies.splice(i, 1);
      if (hearts === 0) {
        cancelAnimationFrame(animationId);
        document.querySelector("#gameover").style.display = "flex";
      }
    }
  }

  // when projectile hits enemy create explosion
  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];
    explosion.draw();
    explosion.update();

    //remove explosion
    if (explosion.frames.current >= explosion.frames.max - 1) {
      explosions.splice(i, 1);
    }
  }

  // if al enemies are eliminated
  if (enemies.length === 0) {
    // win the game if player clears 50 levels
    if (level === maxLevel) {
      cancelAnimationFrame(animationId);
      document.querySelector("#gameover").style.display = "flex";
    } else {
      enemyCount += 2;
      document.querySelector("#level").innerHTML = ++level;
      spawnEnemies(enemyCount);
    }
  }

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  building.forEach((building) => {
    building.update();
    // if enemy falls within the radius of the building(collide), then they are valid enemies
    building.target = null;
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius;
    });
    building.target = validEnemies[0];

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update();
      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);

      // remove projectile when projectile collide with enemy by removing projectile object from the building
      if (distance < projectile.enemy.radius + projectile.radius) {
        // when projectile hits an enemy, minus hp
        projectile.enemy.health -= damage;
        // if hp falls below 0, remove the enemy
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });
          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1);
            coins += 20;
            document.querySelector("#coin").innerHTML = coins;
          }
        }
        explosions.push(
          new Sprite({
            position: { x: projectile.position.x, y: projectile.position.y },
            imgSrc: "images/explosion.png",
            frames: { max: 4 },
            offset: { x: 0, y: 0 },
          })
        );
        building.projectiles.splice(i, 1);
      }
    }
  });
}

const mouse = {
  x: undefined,
  y: undefined,
};

//check if activetile, if active tile and not occupied
canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
    coins -= 50;
    document.querySelector("#coin").innerHTML = coins;
    building.push(
      new Building(
        {
          position: {
            x: activeTile.position.x,
            y: activeTile.position.y,
          },
        },
        attackSpeed
      )
    );
    activeTile.isOccupied = true;
    // sorting the building array ensures that buidlings lower on the x-axis will overlap those above
    // and not the other way around
    building.sort((a, b) => {
      return a.position.y - b.position.y;
    });
  }
  //console.log(building);
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activeTile = null;
  // check if mouse is current over any of the placement tiles
  // if found, break
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
  // console.log(activeTile);
});

const image = new Image();

document.querySelector("#startgame").addEventListener("click", () => {
  document.querySelector("#startscreen").style.display = "none";
  document.querySelector("#status").style.display = "flex";
  document.querySelector("#buffs").style.display = "flex";

  // load game map
  image.src = "/images/game_map.png";
});

// animate the enemy when window is loaded
image.onload = () => {
  animate();
};
