# Defence of the Realms - Tower Defence Game

Tower defence is game whereby players will try to defend their base by placing defensive structures along the path of the enemies.

---

## Project Description

This game was created as an assignment while attending a course at General Assembly. It is implemented using HTML, CSS and Javascript.

### Gameplay

- There are 50 levels to this game, each with increasing level of difficulty. (increased movement speed, increase health)
- Every 5 levels, there will be a boss round. The boss creep will have a reduced movement speed but has a much higher amount of HP.
- The game ends when the player reach level 50 or when the player's health reaches 0.
- Players will start will 100 gold. Each tower cost 50 gold to build.
- Players can place defensive structures along the predefined path the creeps are marching on.
- Players can upgrade the attack speed of the towers.
- Players can upgrade the attack damage of the towers.

### Tools and Libraries used

- HTML Canvas
- VanillaJS
- [Vite](https://vitejs.dev/)
- [Animate.css](https://animate.style/)
- [Tiled Map Editor](https://www.mapeditor.org/)

---

## Deployment

This game is deployed using vercel. >>[Defence of the Realms](https://ga-project1-game-ghvgd3m0r-tripsflop.vercel.app/) <<

---

## Installation

- To install and run the project (in production), use the following commands.

```
npm run build
npm run preview
```

---

## Wireframe

![Screens](/public/assets/wireframe.jpg)

The game will consist of three different screens/overlay.

1. Upon launching the app, players will greeted with the loading screen. The loading screen consists of the title of the game and a **Start Game** button.
2. Upon clicking the start game button, users will be directed to the actual game.
   - The top right of the screen will show the **game status**, such as the level, the amount of gold and the number of hearts left. The
   - The top left of the screen will show the **power ups** available to the players.
3. Upon completion of the game or when the player loses, the game will pause and the third screen will overlay the game screen, showing that the game is over. To replay, players can reload the page by refreshing the app.

## Future/Possible Developments

- To include towers with other abilities (slow,dps)
- To include ability to upgrade towers individually
- To include different maps to have a variation in gameplay
- To include sound effects and background music to have a more immersive gameplay
- To include gameplay instructions on the loading screen

---

## Credits and References

- With no prior experience, creating a game using HTML and JS was a challenge.
- [Chris Courses](https://www.youtube.com/watch?v=C4_iRLlPNFc&t=7554s&ab_channel=ChrisCourses) - Credits to Chris Courses for introducing HTML Canvas concepts such as placing waypoints, collision detection, sprite animation and map building
- [Java2s](http://www.java2s.com/ref/javascript/html-canvas-animation-velocity-with-angle.html) - Credits for explaining concepts such as animation velocity with angle
- [RPGJS](https://docs.rpgjs.dev/guide/create-tileset.html#prerequisites) - Credits for explaining the steps to creating a game

---

## Game Assets

- [2D Knight Sprite](https://free-game-assets.itch.io/free-2d-knight-sprite-sheets)
- [2D Woman Warrior Sprite](https://craftpix.net/freebies/2d-fantasy-woman-warrior-free-sprite-sheets/)
- [2D Fantasy Elf Sprite](https://craftpix.net/freebies/2d-fantasy-elf-free-sprite-sheets/)
- [2D RPG Desert Tileset](https://free-game-assets.itch.io/free-rpg-desert-tileset)
- [HeroIcons](https://heroicons.com/)
