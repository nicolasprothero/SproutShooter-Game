const audio = {
    shoot: new Howl( {
        src: './audio/Basic_shoot_noise.wav',
        volume: 0.1,
    }),

    playerDamage : new Howl( {
        src: './audio/Enemy_damage_taken.wav',
        volume: 0.3,
    }),

    enemyDamage : new Howl( {
        src: './audio/Damage_taken.wav',
        volume: 0.1,
    }),

    gameover : new Howl( {
        src: './audio/gameover.wav',
        volume: 0.1,
    }),

    select : new Howl( {
        src: './audio/Select.wav',
        volume: 0.1,
    }),

    success : new Howl( {
        src: './audio/success.wav',
        volume: 0.1,
    }),

    background : new Howl( {
        src: './audio/backgroundMusic.wav',
        volume: 0.05,
        loop: true,
    }),
}