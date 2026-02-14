Next.js’i çalıştırmak için öncelikle bilgisayarda Node.js’in kurulu olması gerekiyor.
Projeyi indirdikten sonra terminalden proje dizinine gidip "npm install" komutunu çalıştırarak gerekli bağımlılıkları yüklüyoruz.
Daha sonra veritabanı işlemleri için sırasıyla "npx prisma migrate dev" ve "npx prisma generate" komutlarını çalıştırıyoruz; bu sayede schema.prisma dosyamızdaki veriler kullanıma hazır hâle geliyor.
Prisma Studio’yu açmak istersek "npx prisma studio" komutunu kullanabiliriz.
Son olarak "npm run dev" komutuyla Next.js uygulamasını başlatıyoruz ve proje başarıyla çalışmış oluyor.
