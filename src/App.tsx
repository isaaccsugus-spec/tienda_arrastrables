import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, LogOut, Hexagon, X, User, KeyRound, Unlock, AlertCircle } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
// Datos de respaldo por si el backend de FastAPI no está corriendo en localhost
const FALLBACK_PRODUCTS = [
  { id: 1, nombre: 'Phantom Low', precio: 249.00, image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQyOtV7HU_BJOcWaagd6Z1xdHpSKVV9VBWRd7UIlH7cDHmmksEvpI_cXsnVDG3WbtVopQ4N7ZHRBwGQDgIrXr_7Gr5Y5nBGNh4uHPBI_VR2GtEPlwv7GIKMqwBYNYZ68dfZWy3miA&usqp=CAc' },
  { id: 2, nombre: 'Vortex Runner', precio: 380.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0q50B2LKZJRdLrN2ipro4ks1NieZ2xecYQuLMvumKEmwwtl_0xDF45w_iRLwtA-jQ8zq88nbtdSJLR-E6dyNKXuWCpHV1Ywypt5kuAb-JeBAbQh9WUAinEMXwNAatNE_lUiO5DvFw1rGklo7fG6iYCUDLz6zUDw0qlzKFco-dqLO--I0uS4ZpEKfOhPLf1MRuAA81UmdPPzH_QwjuWcld9tnOjn44RDDSkryYUHuVUTVixNKV2JgyCbCj8dQmBEcGKbjCtPArNw' },
  { id: 3, nombre: 'Onyx Blade', precio: 215.00, image: 'data:image/jpeg;base64,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' },
  { id: 4, nombre: 'Nova High', precio: 290.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJhaa3eXSIPaHzXXYOqJKPRbzG0DG0TARm-yYR0P8U9Wgf0l82U6GHhN1nIdeK6VmpyTYhpSNJI4XZJuhQnEMj-GdxxqhT2mn4PI7GFNm1R2LvrSSpx9AWn3jnEMKK_qRP2_Gp8abs2rjyW58QxwC5c9LOEEd3VKTg2PfuoDGdArvSWg60HCI87ESjJjteeeA7IfTs01yfPbwI8NYANFqKw-sP2GibMAn0tjuMhn3pEJIiSgkTd_o6d1s3XMZOmV2f7g9HRZqBqg' },
  { id: 5, nombre: 'Aero Glide', precio: 180.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0q50B2LKZJRdLrN2ipro4ks1NieZ2xecYQuLMvumKEmwwtl_0xDF45w_iRLwtA-jQ8zq88nbtdSJLR-E6dyNKXuWCpHV1Ywypt5kuAb-JeBAbQh9WUAinEMXwNAatNE_lUiO5DvFw1rGklo7fG6iYCUDLz6zUDw0qlzKFco-dqLO--I0uS4ZpEKfOhPLf1MRuAA81UmdPPzH_QwjuWcld9tnOjn44RDDSkryYUHuVUTVixNKV2JgyCbCj8dQmBEcGKbjCtPArNw' }
];

// ===== MAPEO DE IMÁGENES POR ID =====
// Cambia aquí los URLs de las imágenes para cada producto
// Formato: { id: 'URL_IMAGEN_AQUI' }
const PRODUCT_IMAGES: Record<number, string> = {
  
  8:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhESEhIQFhUVFREWFhUYGBYSGBcSFRUWFxkVGBYYHSggGB4lHRUYITEiJSorLi4uFx8zODMvNygtMCsBCgoKDg0OGhAQGzMmICYwLjAtLS83LTcvLS8rLS0vNS0tLy0tNy0tLS0tLS0tNy0vNy0tLS01LS0tLS8vLS8tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYDBAcBAv/EAEYQAAIBAgMEBwQEDAQHAQAAAAABAgMRBBIhBTFBUQYTImFxgZEyobHBQlLR8BQjM0NTVGJykrLT4USjwtIVFmOCosPxB//EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/EACoRAQACAgEDAwEJAQAAAAAAAAABAgMRBBITITFB8CIFFEJRgZGhscFx/9oADAMBAAIRAxEAPwDtIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa9XGRjKMJO2bc3uv8AVvzPvE1lFX56IrW0sQrOM3GSle68OPdbTUiZFqBV+jm3e3+D1ZX/AEVRvWSX0JftLnxLQSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5KSSbe5HpGbVr6qmvGXdyXz8gNDaGPzN62ST8kVzHVd74v3Lgvn4tk1i8Pm0U4X5N7+7dzRWtrUalOVqkZK+7k/BrR+RSZXiGipO6abummn3o6hsPG9dQp1Hvaal+9FuL96v5nK4zOl9FcM4YamnvleflJ3XusTVFkuACyoDxs09p47qlTbtaU0m+UbO7JiJmdQiZiI3LdABCQAAAAAAAAAAAAAAAAAAAAAAPic7XtvswMeLxKpxcmUzpTVqypudKpGK+lrrb9mS09beJJdJ5wqKmrtytOpFJpJpLLx0dnNPXkULCxqK7qZsjhKc3u1+rk8L+hpixdy2lb36I2bPrZZtVMqUnFRk5XnOTu3vW/lZ8y74ecp4adNyTlBZo5kpqUVvjKL0at7ylSw7TU3eWZuULxS6uLjotdfHjd8CY2TtBp1O1dRp2l3S36eSeh0crHWKxaPDHj3tMzEsU9n0Zzi3mpdqOZRvODjfWybvF28V4HS8LWhOKdNxcbK1uC5HN6GJjKx99fKLzQlKL5xdv/vmcMS6pjbpQKTgeltaOlSEaneuxL7CRxG2qtWOWnDq775N5pW/Ztu8Sdo0wbaxzqVXTXsQdnyc+T52+PgauOb6l6uyadr6enDfwM2FwW6MI3f31bMW2XCNKcU80rateyu5c/EtjnV4lXJG6zC44ed4QdrXjF25XS0Mho7Dq5sPQle96VN359lG8LRqZgrO4iQAEJAAAAAAAAAAAAAAA8k7AenkpWNTEY+MLuUlGyb77LiR+M21BWyyTSvKT1fZVlv8AO/kBKVcQk0rpO17cbERjtpyhKUerlJNxSsrrLK0Xd7lbfrwNLaNeNVZozlFK6zRsrrXi1uu/VFex+3LXpUe1kyRqVG1kpRd/xlWbaS9lvhqmlmehERMzqE+jex+LpUZwlObUbyjK8koxjNay14LfxtyKdtx4rCYhxppKkpXy26xzhK2tOELtJSvHW3B8TJtPA6XrZ6lRN05rLKVk23CdHDtO0U011lS0fxV1HtEjsva9OWGnRxsXKFK8ZVE5SUaMo6Zqkkute7SN9JQstNN6UtSepSZi0aQdfbk5OpHJCM+ym43l2XfK8267V3bhckNmRdPCSk9HWnZX+qrq/umSuC6M4fLByl1yX5NpOhBU55WoKlH4vXwJTpB0cVeEI06sqTg7x0eXRWS7Di1Hu5GeW3VbzK1KxWPEK3STS5/fijapVuYexsdTqQi6LqxeROrT0alKWW+XS0FvebVXfBE1/wAs1cuafV09N8pKKfpuM7V0tEtLDSjcn8LS7OecslP6z3y7oriRcuow+5dfV4NpxpR8Fvn8CNxG0KlSWarNt8HuSXJLciEp/FbVunCkssOP1pfvP5EfjZ/ipeBr4epHmfW0a6y5U/E1w16skQyzW6aTK1dCMVnwtOGmalem0uUW8rt3r3pk+UDoLictfJ+khL1i3Je5P1L+a8mnTkllxr9WOAAGDcAAAAAAAAAPGwPQYpYiK4+hhnjOXqwNqUkt5Xuku2JU3SjBe25a+C4GaptDL+U03q++63+pBT2g6k6kaitTdlFO17LdLS9te8RMRPkmJ14RtVyqNttvXtJ3SS0vb7+hu7KajKSbT0a9baPXxMCoyldPtLdpbLJX0fwNiOD+s/Jfb9nvO7JlxxTpj+HLTHebbkx1ZNPgrW0urcmrcuRWsNWjCMKckoaKnNRTqZajSdOtRg4fjZaJuvO/5Kdiy1qSeq0fPno9/qQm09nqSkqkey1JScW12W02uy01quDtprFnHjv0y6rV6oRWPrJQnKaVoZaWKi5XhKLVozq1nDPXmoqCyx0u4vizW2dCXWQinetSyxXZi5Tw0pJN06UZZaEO3bM+1l8DZqYSpDJOE4TcIypu7VOfU3uqdPNlhBrRZ7J9mPFa7HRnAT61OfZVJ1HFRnmzxd1HrZNtzknKUrXSWZ8jonLXW9/Pnzwzik+i44ZKKSW6KSV9XZKyu3vG1NqqjTlNxTtZJaq8nuWnr5HxciukFKNSMKcldXzNNuzauldL2lv0Zx/9bI+HSWpOs5yrVoQcbRgqjyx5t7szfN7jJiNrQerlKT82/WRB7Sw/VztFSkpaxSTk/Cy1PKOz6891PKuc2o/+PtceRG0pZbWcuxl36JLXV6Kz0429TYVGSim47+G/S109OD19GR+E2ROMlJ14xa1WSLlr4y3b9+UlMLhKa1m8RUkm7OVRpWfJKy4veiB8041ItZaUrcbUVJ+5XNnF7PqNWyyd9zUUneySffy8zYjOP/VS5Kdvl4eneMRUvuzW43lmvuL1tNZ3CtqxaNSr+xcRKliqEm7ONSEW76WlJKXk4y952Q47tnA5ss1vi07fWinez71v9eZ1fZGJ62hRqfXp05fxRTOvkZYy1rf39JcnHxzitant6w2wAcrqAAAAAAitu7Zjh1FaOc75Y9y3yfdqvUlJSsm+SbOX9LOvrYh1YwcqeWMYqOsoxWrTjvbu29OaK2tEJiNp7D9IaiVpdvvvZ+e8zLb8HvUk/Uo1PaGV5ZZovk9H6M3aeMT+kV2nS3/8bpfWt4qS7uR5La1J/nI+tirKqny9DNCKa1SGzSwRx8HdKcH3XR5OnF65Y+iICVCD7vfr5nlKVSn7E7r6r+Vydmk69N1kjDVmkm20lzZGvaFVr2IX56s06tKc3ecm+777hs0yYzbCu1TV3zd7ffxNWG2pL24ryuvfuMjopdxt0Ng1Kiu7Ri+e9rwXzKzbSYh8QrUqivHLfimrSXl5G7suilGTSWrt5L+7ZGYvopUj2qU4trhrH03/ACJnZtKUaVNTvmy9q/N6295NbRJMaZmRWMleb9PQlKjsmyEr4ylD26kF3OSv6by0RM+iN6Zaaa3aenzMqpc/fqRU+kuHXsuc/wB2L/1WPl9IJNtQw1ZtRUu12bRk0lJrk80de9GscfJPsznNSPdLdWeqBE1cVjLxj1NOLk5RXaUrSiryjJqVotLWzsyIrbYxF2nJK2lkka04d7e8M7cqlfzXCMTyTRSp7TrPfUka9TGVPryNY+z597MZ5se1V3q07l16KSbw0E+Dkl4J/wB2cfwfSSdNNTjn5O+V+Ddnc6f/APnO1/wnCZnTUHGpOLSlnT1zJ3suEuXA58nHvj9fR0UzVvHhaQAZNAAAAABpbak1Qq23uNv4tPmUaEpw52/iX38DodakpRcZbmrMruL2XKHBtc1r68vO5z5qzPlrSYjwhViFJWlGL7nZ+5mOWy8PL82l+7mh/LoSDw6fCL+/d9hrVqWRp8H7mYbmF2tLo/Ts8k5xfC7zR8GrXRVdobSnSlKnJWlHRr595doVe8iNvbKhiLO9prRS36cmdPGyUi8d30Y5q36fo9VNq7RnLfKXhc8hjJLdKXqyxUeicfpTb8Fb3s3aXRegt+Z+f9j2J5/HrGo/iHmfc81vMx+8q3R23UjxT8V9hv0OkC+lFrvWvuLHQ2Hh4/movxvL4kjQowh7MIR8IpHHl5vHt+D/AD+nTj4uav4/9/tGbCoqq+salki9Mycby8HvSLFOoYHX7z5czzL26p3DvrGo8vqVQ+JVVxXmvvqfMpGvUmREzHomY2hemWKy0VBN9uSu7OyitbN2tq7aeJRWly+Z0jE2kmpJNPenqmaWE2dh4v8AI0/FrP8AzXsenxufXHTptHlw5+Ja9txKl4fEzSlCLdp2UklmutV/qZbMTi51pVJQwuLu4V6UJNXTpTblTvdRy5JKNlro2r6I0MQtp55qFowzSy9XCCSjfSzvfdzLDjMTWnCyhVg8jVoxTu2rK7m9/ejS/Ni3mIj91a8WY8bRm08FjMRnX4MoRlVdWPapQccyanF5bZ7uzu9ez3mlHohiuKpLxn9iZqT2LjZJJrES8ZQj8Wyf2Js6pGtTqSpOnlg4yk6kZuay5UmorXWz8u4p99vWPp18/Vb7pS0+d/P0aFPoZiHvlRX/AHSfwibMOg0vpV4Lwi5fFotrm+CXn9h43LjJ+Vl9rMp+0c0+60cLFHsrK6EUV7dSrLwywXno37y99EcBRo4aMaCSi5Sb1cryvZ3b8EQzwqk91333n/Ne3kWbZGGdOnle9tu2+17fYUjkZMk/VO2nZpSPEN0AFgAAAAAeM0MXTxL/ACdSgv3oS+0kABUdobL2lO9qmB8csov1UbkNjNg7YcXFSwMk7fSmmmmmn7PcdHBWaRPqmLTDlcdh7Yjvw+En4V8vxiz4ex9qddCo8GsqhOMoxrU5atppq9r7vedXBXtV/JbrlzeNLHLfgMR5SoP/ANp9KOM/UcV/lfKodGBHZqdyXOYLGa3wOJ36fktVz9s+rYz9RxX+T/UOiAdmp3Jcyrwx2aNsBi7K7dnQ5WS1q9/wMyWN/UcUvOj/AFDo4HZqdyXN508bwwWK9aP9QwSw2Pf+CxHrQ/qHTwOzU7kuWvZmPf8AhK3nKj/vPVsfH/q1T+Kl/vOogdmp3Jc92ZgcclJVcLP2uzZ0fYst/wCM33v7iQjhMT+rVP4qP9QuQHZg65U54HFaWwz3q950Vpxek3d9xlWzMT+iS8ZwXwuWwE9qp1yqq2TiuEKC8asvlTZ5LYuMe54SL5uVSp7ssfiWsDtVR1yhdmbOxFP2quHfeqcr+rkTMe/7D0F4jSoACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//Z',
  9:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ57fp4-RA-EH6qdm7q0aiNPykYPJXH3TQNDVTuNDf1bY5kp7XpaK_B1HSfHKtHSc-TmKCxhHJAHn9qvw2My--budNkfcBnhQ4CN1Te4lqx9O-wp_S-awtisw',
  10:'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcToiTL87AroQMcy8RiiRJlJnwXrFXSve9PRDb5ln7d5TrYaG8MdZt-phrIXOC2Z32pSQ6F9ktrlE9slpstd_paXxbYhRc_NBYSpJ8hoaK7yThVdGRMJkPvo5g',
  11:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTqN-OoH5El3F9KC1-qKGQJnV2zkciaMOIUlP7CesjbRK_BbfhcXFMRedyyabzYJcDq0Ataz-GXsfQvqkC1HS7Rakm2spk1Pm5PR_OU2uwAE2cCkynUQMZKLg',
  12:'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRJmDhF9DX1d1TTGvr_WvGY6kxatASHX7CAqlrx1_izkc6yf52c6KyhRDnh9wgo0GbQcE_rwOVThr_mb_anBO7t_4L-0ILoDNVDGkVhB8roLjy1gUYNSNUa',
  13:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTbjPYKiTfU8_hbaK6hmerowwKxUjsbAtqQCVBiS1SA1I10oDSnSS5-COrUpr-qTFLpA41Wo_k196b3FFWKGk4MRGRaGy4Ua1zgkQ9DswgNj71ykv9ILLZFgA',
  14:'https://mthorshop.com/cdn/shop/files/Louis_Vuitton_Nike_Air_Force_1_Low_By_Virgil_Abloh_Metallic_Gold.webp?v=1766164808&width=800'


};
export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  if (!token) {
    return <AuthScreen setToken={setToken} />;
  }

  return <Store token={token} setToken={setToken} />;
}

// ==========================================
// VISTA 1: AUTH (LOGIN / REGISTRO INTERACTIVO)
// ==========================================
function AuthScreen({ setToken }: { setToken: (token: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isFormUnlocked, setIsFormUnlocked] = useState(false);

  const portalRef = useRef<HTMLDivElement>(null);
  const keyControls = useAnimation();

  // Reset states when switching modes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setIsFormUnlocked(false);
    setShowPassword(false);
    if (isLogin) {
      setNombre('');
      setPassword('');
    }
    keyControls.start({ x: 0, y: 0, scale: 1, opacity: 1 });
  }, [isLogin, keyControls]);

  // Set page title
  useEffect(() => {
    document.title = 'LUXE - Premium Sneaker Shop';
  }, []);

  // Email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuthAction = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      // LOGIN LOGIC (URLSearchParams)
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      try {
        const res = await axios.post('http://localhost:8000/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const accessToken = res.data.access_token;
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
      } catch (err: any) {
        console.error("Error en login real:", err);
        setError('Email o contraseña incorrectos. Intenta de nuevo.');
        setIsFormUnlocked(false);
        await keyControls.start({ x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: 0.3 } });
      } finally {
        setLoading(false);
      }
    } else {
      // REGISTER LOGIC (JSON)
      try {
        await axios.post('http://localhost:8000/registro', {
          nombre: nombre,
          email: email,
          password: password,
          es_admin: false
        });
        
        setSuccessMsg('¡Cuenta creada con éxito! Inicia sesión.');
        setTimeout(() => {
          setIsLogin(true);
          setIsFormUnlocked(false);
          keyControls.start({ x: 0, y: 0, scale: 1, opacity: 1 });
        }, 2000);
      } catch (err: any) {
        console.error("Error en registro:", err);
        setError('Error al crear la cuenta. Intenta de nuevo.');
        setIsFormUnlocked(false);
        await keyControls.start({ x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: 0.3 } });
      } finally {
        setLoading(false);
      }
    }
  };



  const handleDragEnd = async (e: any, info: any) => {
    if (!portalRef.current) return;
    
    const portalRect = portalRef.current.getBoundingClientRect();
    const { x, y } = info.point;

    // Hit area for the portal - EXPANDED for easier drag
    const hitArea = 100;
    const isColliding = 
      x >= portalRect.left - hitArea &&
      x <= portalRect.right + hitArea &&
      y >= portalRect.top - hitArea &&
      y <= portalRect.bottom + hitArea;

    if (isColliding) {
      // Validate inputs before unlocking
      if (!email || !password || (!isLogin && !nombre)) {
        setError('Por favor, completa todos los campos.');
        await keyControls.start({ x: 0, y: 0, transition: { duration: 0.3 } });
        return;
      }

      // Validate email format
      if (!isValidEmail(email)) {
        setError('El email debe ser válido (ej: usuario@ejemplo.com)');
        await keyControls.start({ x: 0, y: 0, transition: { duration: 0.3 } });
        return;
      }

      // All validations passed - Unlock!
      setError(''); // Clear any errors
      
      // Set form as unlocked FIRST so button becomes enabled immediately
      setIsFormUnlocked(true);
      
      // THEN animate the key disappearing
      await keyControls.start({ 
        scale: 0, 
        opacity: 0, 
        rotate: 180,
        transition: { duration: 0.4 } 
      });
    } else {
      // Snap back if not dropped on portal (shake animation)
      await keyControls.start({ 
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4, type: "spring" }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-slate-100 font-sans overflow-hidden relative selection:bg-[#ec5b13] selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,_rgba(236,91,19,0.1)_0px,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ec5b13]/5 rounded-full blur-[150px] pointer-events-none" />

      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-8">
        <div className="flex items-center gap-3 text-[#ec5b13]">
          <Hexagon className="w-10 h-10 fill-current" />
          <h2 className="text-2xl font-black tracking-[0.2em]">LUXE</h2>
        </div>
      </header>

      <main className="relative grow flex items-center justify-center px-4 z-10">
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-md p-10 rounded-[2rem] shadow-2xl bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/5 relative overflow-hidden"
        >
          {/* Toggle Login/Register */}
          <div className="flex justify-center mb-10 relative z-20">
            <div className="bg-black/50 p-1 rounded-full flex gap-1 border border-white/5">
              <button 
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all ${isLogin ? 'bg-[#ec5b13] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                LOGIN
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all ${!isLogin ? 'bg-[#ec5b13] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                REGISTER
              </button>
            </div>
          </div>

          <div className="text-center mb-8 relative z-20">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {isLogin ? 'Bienvenido' : 'Únete a la Elite'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Auténticate para acceder a la bóveda.' : 'Crea tus credenciales.'}
            </p>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm font-bold text-center mb-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-400 text-sm font-bold text-center mb-4 bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5 relative z-20">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="nombre-input"
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#ec5b13] transition-colors z-10" />
                  <motion.input 
                    whileFocus={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ec5b13]/50 transition-all" 
                    placeholder="Full Name" 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#ec5b13] transition-colors z-10" />
              <motion.input 
                whileFocus={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ec5b13]/50 transition-all" 
                placeholder="name@example.com" 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#ec5b13] transition-colors z-10" />
              <motion.input 
                whileFocus={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ec5b13]/50 transition-all" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ec5b13] transition-colors z-10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <button
            onClick={handleAuthAction}
            disabled={loading || !email || !password || (!isLogin && !nombre) || !isFormUnlocked}
            className="w-full mt-8 h-14 bg-[#ec5b13] text-white rounded-2xl font-bold text-lg uppercase tracking-widest hover:bg-[#d94a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
            title={!isFormUnlocked ? '🔒 Arrastra la clave al portal para desbloquear' : 'Pulsa para confirmar'}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* UNLOCK ZONE - Arrastra la clave aquí para desbloquear el botón */}
          {!isFormUnlocked && (
            <motion.div 
              ref={portalRef}
              className="mt-8 relative h-24 rounded-2xl border-2 border-dashed border-[#ec5b13]/30 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#ec5b13]/5 rounded-2xl" />
              
              {/* Loading animation in portal */}
              {loading && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute z-20 flex flex-col items-center gap-2"
                >
                  <div className="w-6 h-6 border-3 border-[#ec5b13] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-[#ec5b13] font-bold">Procesando...</span>
                </motion.div>
              )}
              
              {/* Draggable Key */}
              {!loading && (
                <motion.div
                  drag
                  dragConstraints={{ left: -300, right: 300, top: -100, bottom: 100 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  animate={keyControls}
                  whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.05, cursor: 'grab' }}
                  className="relative z-10 flex flex-col items-center gap-2 cursor-grab"
                >
                  <KeyRound className="w-8 h-8 text-[#ec5b13]" />
                  <span className="text-xs text-gray-500 font-bold">Arrastra</span>
                </motion.div>
              )}
              
              {/* Portal Unlock Zone */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
              >
                <Unlock className="w-6 h-6 text-[#ec5b13]/60" />
                <span className="text-[10px] text-gray-600 font-bold">ZONA</span>
              </motion.div>
            </motion.div>
          )}

          {/* Success Message when unlocked */}
          {isFormUnlocked && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
            >
              <p className="text-green-400 text-sm font-bold">
                ✓ Formulario desbloqueado. Pulsa el botón para confirmar.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// ==========================================
// VISTA 2: TIENDA (VLT. / ESCAPARATE REAL)
// ==========================================
function Store({ token, setToken }: { token: string, setToken: (token: string | null) => void }) {
  const [productos, setProductos] = useState<any[]>([]);
  
  // ESTADOS DEL CARRITO
  const [carrito, setCarrito] = useState<any[]>(() => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [cartNotification, setCartNotification] = useState<{nombre: string, cantidad: number} | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderItems, setLastOrderItems] = useState<any[]>([]);
  
  const [swallowed, setSwallowed] = useState<number[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const ballStorageRef = useRef<HTMLDivElement>(null);
  const [storedBalls, setStoredBalls] = useState(0);
  const [showBallStorage, setShowBallStorage] = useState(false);
  const [savedBallStates, setSavedBallStates] = useState({ ball1: false, ball2: false, ball3: false, ball4: false });

  // Función para detectar colisión con almacén
  const checkBallCollision = (ballPos: { x: number; y: number }, ballSize: number = 64) => {
    if (!ballStorageRef.current) return false;
    const storageRect = ballStorageRef.current.getBoundingClientRect();
    
    const ballCenterX = ballPos.x + ballSize / 2;
    const ballCenterY = ballPos.y + ballSize / 2;
    
    return (
      ballCenterX >= storageRect.left &&
      ballCenterX <= storageRect.right &&
      ballCenterY >= storageRect.top &&
      ballCenterY <= storageRect.bottom
    );
  };

  const handleBallStore = (ballKey: string) => {
    setSavedBallStates(prev => ({ ...prev, [ballKey]: true }));
    setStoredBalls(prev => prev + 1);
  };

  // Función para reproducir sonido de éxito
  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do alto
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Mi
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Sol
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
  };

  // Función para reproducir sonido de agregar al carrito
  const playAddSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Set page title
  useEffect(() => {
    document.title = 'LUXE - Premium Sneaker Shop';
  }, []);

  // Carga de Productos
  useEffect(() => {
    axios.get('http://localhost:8000/productos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProductos(res.data))
    .catch(err => {
      console.warn("Usando datos de respaldo. El backend real no respondió:", err);
      setProductos(FALLBACK_PRODUCTS);
    });
  }, [token]);

  // Disposición 'Caos Controlado' (Scattered Layout)
  const scatteredStyles = useMemo(() => {
    return productos.map(() => ({
      rotate: Math.random() * 45 - 22.5, // Rotación entre -22.5deg y +22.5deg
      x: Math.random() * 300 - 150,      // Desplazamiento X aleatorio mayor
      y: Math.random() * 300 - 150,      // Desplazamiento Y aleatorio mayor
      posX: Math.random() * 75 + 10,     // Posición X inicial en %
      posY: Math.random() * 75 + 10      // Posición Y inicial en %
    }));
  }, [productos]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setShowLogoutConfirm(false);
  };

  // Lógica de Colisión (Drop) -> Añade al carrito, NO hace POST
  const handleDragEnd = (e: any, info: any, producto: any) => {
    if (!cartIconRef.current) return;
    
    const cartRect = cartIconRef.current.getBoundingClientRect();
    const { x, y } = info.point;

    const hitArea = 50;
    const isColliding = 
      x >= cartRect.left - hitArea &&
      x <= cartRect.right + hitArea &&
      y >= cartRect.top - hitArea &&
      y <= cartRect.bottom + hitArea;

    if (isColliding) {
      // Se añade al estado del carrito
      setCarrito(prev => {
        const existing = prev.find(item => item.id === producto.id);
        let cantidadAdd = 1;
        if (existing) {
          cantidadAdd = existing.cantidad + 1;
          return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
        }
        return [...prev, { ...producto, cantidad: 1 }];
      });

      // Mostrar notificación toast
      setCartNotification({ nombre: producto.nombre, cantidad: 1 });
      playAddSound();
      setTimeout(() => setCartNotification(null), 2500);
    }
  };

  // El Checkout Real (API POST) -> Disparado desde el botón "Pagar"
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const items = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad
      }));

      await axios.post('http://localhost:8000/pedidos', { items }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Éxito real
      const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      setLastOrderTotal(total);
      setLastOrderItems([...carrito]);
      setCarrito([]);
      localStorage.removeItem('carrito');
      setIsCartOpen(false);
      setShowConfetti(true);
      playSuccessSound();
      setShowSuccessModal(true);
      setNotification('¡Compra realizada con éxito!');
      setTimeout(() => {
        setNotification('');
        setShowConfetti(false);
      }, 4000);
    } catch (error) {
      console.error("Error al registrar el pedido en el backend:", error);
      // BYPASS PARA DEMO
      const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      setLastOrderTotal(total);
      setLastOrderItems([...carrito]);
      setCarrito([]);
      localStorage.removeItem('carrito');
      setIsCartOpen(false);
      setShowConfetti(true);
      playSuccessSound();
      setShowSuccessModal(true);
      setNotification('¡Compra realizada con éxito! (Demo)');
      setTimeout(() => {
        setNotification('');
        setShowConfetti(false);
      }, 4000);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalCart = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const cartItemCount = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-gray-100 overflow-hidden relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#D4AF37', '#ec5b13', '#0a0a0a', '#ffffff']}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      {/* Modal de Éxito de Compra */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[400]"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#D4AF37] rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">¡COMPRA EXITOSA!</h2>
                <p className="text-gray-300">Gracias por tu pedido</p>
              </div>

              {/* Items */}
              <div className="mb-6 max-h-64 overflow-y-auto">
                <h3 className="text-[#ec5b13] font-bold mb-3">Artículos:</h3>
                <div className="space-y-2">
                  {lastOrderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded border border-[#333]">
                      <div>
                        <p className="text-gray-100 font-medium">{item.nombre}</p>
                        <p className="text-gray-400 text-sm">Cantidad: {item.cantidad}</p>
                      </div>
                      <p className="text-[#D4AF37] font-bold">${(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#1a1a1a] border border-[#D4AF37] p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">${lastOrderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-[#ec5b13] to-[#D4AF37] text-black font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(236,91,19,0.5)] transition-all"
              >
                Continuar Comprando
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notificación de Compra Finalizada */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notificación al Agregar al Carrito */}
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-28 left-8 z-[300] bg-[#ec5b13]/90 backdrop-blur-md text-white px-6 py-4 rounded-xl font-bold shadow-[0_8px_32px_rgba(236,91,19,0.4)] border border-[#ec5b13]/50 max-w-xs"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 bg-green-400 rounded-full"
              />
              <div>
                <p className="text-sm">✓ Agregado al carrito</p>
                <p className="text-xs text-white/80">{cartNotification.nombre}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 pointer-events-none">
        <div className="text-2xl font-black tracking-tighter italic pointer-events-auto">VLT.</div>
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] transition-colors pointer-events-auto"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 max-w-sm mx-4 text-center"
            >
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-[#D4AF37]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¿Estás seguro?</h2>
              <p className="text-gray-400 text-sm mb-6">¿Deseas salir de tu cuenta?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-yellow-400 text-black rounded-lg font-bold transition-colors"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Ambient Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Contenedor Amplio (Scattered Layout - Caos Total) */}
      <main className="min-h-screen w-full relative overflow-hidden p-10 pt-32 pb-40 z-10">
        {productos.map((producto, index) => {
          const style = scatteredStyles[index] || { rotate: 0, x: 0, y: 0, posX: 50, posY: 50 };

          return (
            <motion.div
              key={producto.id}
              // Magia Interactiva en el Drag & Drop
              drag
              dragConstraints={{ left: -window.innerWidth, right: window.innerWidth, top: -window.innerHeight, bottom: window.innerHeight }}
              dragElastic={0.2}
              onDragEnd={(e, info) => handleDragEnd(e, info, producto)}
              
              // Animación inicial (caos controlado)
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: style.rotate, x: style.x, y: style.y }}
              // Hover y Drag mágicos
              whileHover={{ scale: 1.1, zIndex: 50, rotate: 0 }}
              whileDrag={{ scale: 1.15, zIndex: 100, cursor: 'grabbing' }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              
              className="absolute bg-[#1A1A1A] w-64 h-96 rounded-2xl border border-white/10 p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col cursor-grab"
              style={{ left: `${style.posX}%`, top: `${style.posY}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex justify-between items-start mb-4 pointer-events-none">
                <span className="text-xs font-bold opacity-50">0{index + 1}</span>
                <span className="text-xs font-bold text-[#D4AF37]">
                  {index % 2 === 0 ? 'AIR' : 'ELITE'}
                </span>
              </div>
              
              <div className="flex-grow flex items-center justify-center py-4 pointer-events-none">
                <img 
                  src={PRODUCT_IMAGES[producto.id] || 'https://via.placeholder.com/300x300?text=Sin+imagen'} 
                  alt={producto.nombre} 
                  className="w-full object-contain drop-shadow-2xl"
                />
              </div>
              
              <div className="mt-auto pointer-events-none">
                <h3 className="font-bold text-lg uppercase tracking-tight">{producto.nombre}</h3>
                <p className="text-[#D4AF37] font-mono">${producto.precio.toFixed(2)}</p>
              </div>
            </motion.div>
          );
        })}
      </main>

      {/* Floating Hint */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-40 z-0">
        <p className="text-[10px] uppercase tracking-[0.4em] font-light">Arrastra la tarjeta al carrito para comprar</p>
      </div>

      {/* Pelotas Draggables - Física de Rebote Extremo con Mayor Movimiento */}
      {/* Pelota 1 - Naranja/Oro */}
      {!savedBallStates.ball1 && (
        <motion.div
          drag
          dragConstraints={{ left: -50, right: window.innerWidth - 34, top: -50, bottom: window.innerHeight - 34 }}
          dragElastic={1.2}
          dragMomentum={{ power: 0.8, timeConstant: 400 }}
          onDragEnd={(e, info) => {
            if (checkBallCollision(info.point)) {
              handleBallStore('ball1');
            }
          }}
          whileDrag={{ scale: 1.15 }}
          initial={{ x: 50, y: 200 }}
          animate={{ y: [50, 400, 50], x: [50, 150, 50] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#ec5b13] to-[#D4AF37] shadow-[0_0_40px_rgba(236,91,19,0.9)] cursor-grab active:cursor-grabbing z-[150] border-3 border-white/40"
        />
      )}

      {/* Pelota 2 - Oro/Naranja */}
      {!savedBallStates.ball2 && (
        <motion.div
          drag
          dragConstraints={{ left: -50, right: window.innerWidth - 34, top: -50, bottom: window.innerHeight - 34 }}
          dragElastic={1.2}
          dragMomentum={{ power: 0.8, timeConstant: 400 }}
          onDragEnd={(e, info) => {
            if (checkBallCollision(info.point)) {
              handleBallStore('ball2');
            }
          }}
          whileDrag={{ scale: 1.15 }}
          initial={{ x: window.innerWidth - 100, y: 200 }}
          animate={{ y: [100, 450, 100], x: [window.innerWidth - 100, window.innerWidth - 200, window.innerWidth - 100] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="fixed top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#ec5b13] shadow-[0_0_40px_rgba(212,175,55,0.9)] cursor-grab active:cursor-grabbing z-[150] border-3 border-white/40"
        />
      )}

      {/* Pelota 3 - Negro/Gris */}
      {!savedBallStates.ball3 && (
        <motion.div
          drag
          dragConstraints={{ left: -50, right: window.innerWidth - 34, top: -50, bottom: window.innerHeight - 34 }}
          dragElastic={1.2}
          dragMomentum={{ power: 0.8, timeConstant: 400 }}
          onDragEnd={(e, info) => {
            if (checkBallCollision(info.point)) {
              handleBallStore('ball3');
            }
          }}
          whileDrag={{ scale: 1.15 }}
          initial={{ x: window.innerWidth / 2 - 32, y: 150 }}
          animate={{ x: [window.innerWidth / 2 - 32, window.innerWidth / 2 + 150, window.innerWidth / 2 - 32], y: [150, 500, 150] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="fixed top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#0a0a0a] to-[#2a2a2a] shadow-[0_0_40px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing z-[150] border-3 border-[#D4AF37]/50"
        />
      )}

      {/* Pelota 4 - Blanco/Plateado */}
      {!savedBallStates.ball4 && (
        <motion.div
          drag
          dragConstraints={{ left: -50, right: window.innerWidth - 34, top: -50, bottom: window.innerHeight - 34 }}
          dragElastic={1.2}
          dragMomentum={{ power: 0.8, timeConstant: 400 }}
          onDragEnd={(e, info) => {
            if (checkBallCollision(info.point)) {
              handleBallStore('ball4');
            }
          }}
          whileDrag={{ scale: 1.15 }}
          initial={{ x: 200, y: window.innerHeight - 200 }}
          animate={{ x: [200, 350, 200], y: [window.innerHeight - 200, 200, window.innerHeight - 200] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="fixed top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-300 shadow-[0_0_40px_rgba(255,255,255,0.7)] cursor-grab active:cursor-grabbing z-[150] border-3 border-[#ec5b13]/50"
        />
      )}

      {/* Almacén de Pelotas (Esquina Izquierda) */}
      <div className="fixed bottom-32 left-6 z-[140]">
        <motion.div
          ref={ballStorageRef}
          onClick={() => setShowBallStorage(!showBallStorage)}
          whileHover={{ scale: 1.1 }}
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border-2 border-dashed border-[#D4AF37]/60 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all"
        >
          <div className="text-center">
            <p className="text-2xl font-black text-[#D4AF37]">{storedBalls}</p>
            <p className="text-xs text-gray-400 uppercase">Pelotas</p>
          </div>
        </motion.div>
      </div>

      {/* Panel Almacén Expandible */}
      <AnimatePresence>
        {showBallStorage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-40 left-6 z-[145] bg-gradient-to-b from-[#1A1A1A] to-[#0a0a0a] border-2 border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl w-64"
          >
            <h3 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-widest">Almacén de Pelotas</h3>
            <p className="text-gray-400 text-sm mb-4">Arrastra pelotas aquí para guardarlas. Tienes <span className="text-[#D4AF37] font-bold">{storedBalls}</span> guardadas.</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (storedBalls > 0) {
                  // Liberar una pelota aleatoria
                  const keys = Object.keys(savedBallStates) as Array<keyof typeof savedBallStates>;
                  const availableToRelease = keys.filter(key => savedBallStates[key]);
                  
                  if (availableToRelease.length > 0) {
                    const randomKey = availableToRelease[Math.floor(Math.random() * availableToRelease.length)];
                    setSavedBallStates(prev => ({ ...prev, [randomKey]: false }));
                    setStoredBalls(prev => prev - 1);
                  }
                }
              }}
              disabled={storedBalls === 0}
              className="w-full bg-gradient-to-r from-[#ec5b13] to-[#D4AF37] text-black font-bold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(236,91,19,0.5)]"
            >
              Sacar Pelota
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Drop Zone (Cart) */}
      <div className="fixed bottom-12 right-12 z-[100]">
        <motion.div 
          ref={cartIconRef}
          onClick={() => setIsCartOpen(true)}
          animate={cartItemCount > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="w-32 h-32 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.2)] border-2 border-dashed border-[#D4AF37]/40 transition-all duration-500 group cursor-pointer hover:bg-[#D4AF37]/10"
        >
          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-[spin_10s_linear_infinite]" />
          
          <ShoppingBag className="h-12 w-12 text-[#D4AF37] transition-transform group-hover:scale-110" />
          
          <AnimatePresence>
            {cartItemCount > 0 && (
              <motion.div 
                key={cartItemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#0A0A0A]"
              >
                {cartItemCount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interfaz del Carrito (Sidebar Modal) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end pointer-events-none">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />
            
            {/* Sidebar Cart */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#1A1A1A]/90 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col shadow-2xl pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-widest text-[#D4AF37]">TU CARRITO</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {carrito.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">El carrito está vacío.</p>
                ) : (
                  carrito.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <img 
                        src={item.image || FALLBACK_PRODUCTS.find(p => p.id === item.id)?.image} 
                        alt={item.nombre} 
                        className="w-14 h-14 object-contain" 
                      />
                      <div className="flex-1">
                        <h4 className="font-bold uppercase text-sm">{item.nombre}</h4>
                        <p className="text-[#D4AF37] font-mono text-xs">${item.precio.toFixed(2)}</p>
                      </div>
                      <div className="text-lg font-bold bg-black/50 w-8 h-8 flex items-center justify-center rounded-lg">
                        x{item.cantidad}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 uppercase tracking-widest text-sm">Total</span>
                  <span className="text-2xl font-bold text-[#D4AF37] font-mono">${totalCart.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={carrito.length === 0 || checkoutLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#ec5b13] to-[#D4AF37] text-black rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(236,91,19,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? 'Procesando...' : 'Pagar'}
                  {!checkoutLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
