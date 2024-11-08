import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../libs/db_users";  // Usa la nueva ruta de db.js


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/signin', // Personaliza la página de inicio de sesión si lo deseas
    error: '/api/auth/error',    // Ruta para manejar errores
  },
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de definir esta variable en .env.local  

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirige al usuario después de iniciar sesión
      //return baseUrl; // O puedes cambiarlo a otro lugar específico
      return 'http://localhost:3000/menu';
    },
  },  

};

export default NextAuth(authOptions);
