import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../libs/db_users";  // Usa la nueva ruta de db.js
import bcrypt from "bcryptjs";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user._id.toString(),
            name: `${user.firstname} ${user.secondname}`,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      }
    }),    
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
    async session({ session, user, token }) {
      session.user.id = token.sub;
      session.user.email = token.email;
      session.user.role = token.role || "user"; // Puedes incluir más datos si lo deseas
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    }    
  },  
};

export default NextAuth(authOptions);
