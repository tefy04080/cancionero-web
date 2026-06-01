import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const songs = [
  {
    title: 'Tierra Beniana',
    rhythmType: 'Taquirari',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `Tierra beniana, corazón de la selva,
donde el Mamoré canta su canción,
tus guacamayas vuelan libres y bellas,
y el taquirari nace del corazón.

Beni querido, tierra de mi amor,
con tus palmeras y tu verde mar,
el canto del sarao llena el calor,
y los macheteros van a danzar.

Orgullo beniano, cultura sin igual,
tu gente es alegre, tu tierra es real,
con ritmos y danzas que nacen del alma,
el Beni es mi vida, mi paz y mi calma.`,
  },
  {
    title: 'La Chovena del Río',
    rhythmType: 'Chovena',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `Por las aguas del Iténez y el Beni,
la chovena suena con su alegría,
los pescadores cantan al amanecer,
mientras el sol pinta el cielo al nacer.

Ay, chovena, ritmo de mi tierra,
que en cada fiesta el corazón despierta,
las mariposas bailan con el viento,
y los benianos bailan sin lamento.

Ritmo ancestral de nuestra cultura,
que la naturaleza nos da con ternura,
el boto rosado danza en el río,
y la chovena llena el suelo mío.`,
  },
  {
    title: 'Macheteros de la Selva',
    rhythmType: 'Macheteros',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `Con plumas de guacamaya adornados,
los macheteros bailan con valor,
herencia de los pueblos originarios,
que guardan con orgullo y con amor.

Machetero, danza de guerrero,
que el Beni conserva con fervor,
tus movimientos fuertes y certeros,
son el alma del pueblo y su esplendor.

Moxeño, Tsimane, Chimane,
pueblos del Beni con identidad,
sus danzas y rituales nos hacen grande,
y forjan nuestra propia libertad.`,
  },
  {
    title: 'Mi Trinidad Querida',
    rhythmType: 'Taquirari',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `Trinidad, ciudad de las palmeras,
capital del Beni con su calor,
tus tardes de lluvia y tus noches enteras,
me llenan el pecho de puro amor.

En la plaza principal me esperabas,
con tu taquirari y tu alegría,
las jovencitas se peinaban y bailaban,
y el acordeón sonaba toda el día.

Trinidad bonita, te llevo en el alma,
aunque esté lejos nunca te olvidaré,
tu sabor, tu aroma, tu gente y tu calma,
son el paraíso donde siempre volveré.`,
  },
  {
    title: 'Sarao Beniano',
    rhythmType: 'Sarao',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `El sarao suena en la noche beniana,
cuando la luna se asoma al Mamoré,
parejas bailando con gracia galana,
y el corazón late con alegre fe.

Ay, sarao, baile de mi tierra,
que en cada fiesta nos llena de emoción,
la selva entera con tu ritmo despierta,
y los benianos bailan con devoción.

Bajo las estrellas del cielo beniano,
el acordeón llora su melodía,
tomados de la mano, beniano por beniano,
el sarao es nuestra mejor alegría.`,
  },
  {
    title: 'Sirilla del Mamoré',
    rhythmType: 'Sirilla',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `Orillas del Mamoré, sirilla beniana,
el barco de vela lleva nuestro amor,
la sirilla suena en la tarde lejana,
mezclando nostalgia con dulce calor.

Mujer beniana, reina de la selva,
con tu sirilla me robas el corazón,
tus ojos son ríos donde el alma sueña,
y tu sonrisa es sol de esta canción.

Río Mamoré, testigo de mis penas,
llevas mis suspiros hasta el horizonte,
la sirilla es el alma que me llena,
cuando recuerdo el Beni desde el monte.`,
  },
  {
    title: 'Baile del Monte',
    rhythmType: 'Baile del Monte',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `En lo profundo de la selva beniana,
donde los jaguares rondan al anochecer,
suena el tambor con su voz ancestral,
y el baile del monte empieza a florecer.

Con pinturas en el cuerpo y plumas en la frente,
los danzarines honran a la naturaleza,
la selva entera aplaude reverente,
y el monte se alegra con su grandeza.

Baile del monte, danza sagrada,
que los pueblos originarios nos dejaron,
con cada paso, con cada pisada,
la historia y cultura nos heredaron.`,
  },
  {
    title: 'Guacamaya Beniana',
    rhythmType: 'Taquirari',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'APPROVED',
    lyrics: `Guacamaya de colores, reina del Beni,
con tu rojo y verde pintas el cielo,
eres el símbolo de esta tierra mía,
y tu vuelo libre es nuestro anhelo.

En los árboles de majo y motacú,
anidas tus pichones con amor,
el Beni te cuida, te protege tú,
eres nuestra joya, nuestro mejor color.

Guacamaya beniana, no te vayas,
quédate en nuestros ríos y montes verdes,
que mientras el taquirari baile y haya,
tu vuelo en el cielo jamás se pierde.`,
  },
]

async function main() {
  console.log('🌿 Iniciando seed del Cancionero del Beni...')

  // Crear usuario admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cancionero-beni.bo' },
    update: {},
    create: {
      name: 'Administrador Beni',
      email: 'admin@cancionero-beni.bo',
      role: 'ADMIN',
    },
  })

  // Crear usuario moderador
  const moderator = await prisma.user.upsert({
    where: { email: 'moderador@cancionero-beni.bo' },
    update: {},
    create: {
      name: 'Moderador Cultural',
      email: 'moderador@cancionero-beni.bo',
      role: 'MODERATOR',
    },
  })

  // Crear canciones
  for (const song of songs) {
    await prisma.song.create({
      data: {
        ...song,
        authorId: admin.id,
      },
    })
  }

  // Canción pendiente de ejemplo
  await prisma.song.create({
    data: {
      title: 'Nueva Canción Pendiente',
      rhythmType: 'Chovena',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'PENDING',
      lyrics: 'Esta es una canción de ejemplo que está esperando ser revisada por los moderadores...',
      authorId: moderator.id,
    },
  })

  console.log(`✅ Seed completado: ${songs.length} canciones aprobadas + 1 pendiente`)
  console.log(`👤 Admin: ${admin.email}`)
  console.log(`👤 Moderador: ${moderator.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
