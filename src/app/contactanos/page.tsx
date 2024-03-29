import Image from "next/image";

const ContactPage = () => {
    return (

        //I want the following: A header saying "Contactanos" on the top of the page. On the Left side, on the top should be the companies phone number, and on the bottom it 
        // should be the companies opening hours. On the right side it should be a google maps embed with the location of the company.
        <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-14rem)] flex items-center justify-center text-blue-800">
            {/* BOX */}
            <div className=" h-full shadow-2xl rounded-md flex w-full flex-col md:flex-row md:h-[80%] lg:w-[80%] 2xl:w-[65%] ">
                {/* IMAGE CONTAINER */}
                <div className="relative h-1/3 w-full md:h-full md:w-1/2">
                    <Image src="/contactanosLosToneles.jpg" alt="" fill className="object-cover" />
                </div>
                {/* FORM CONTAINER */}
                <div className="p-4 md:p-10 flex flex-col md:gap-8 gap-3 md:w-1/2 h-[67%] md:h-full ">
                    <h1 className="font-bold text-3xl xl:text-4xl">Contactanos</h1>
                    <p className="text-lg "><b>Telefono:</b> <span className="text-black">1234567890</span></p>
                    <span>
                        <p className="text-lg"><b>Horario de Atencion:</b></p>
                        <p className="text-lg text-black">Lunes - Sabado: 10:00 am - 7:00 pm</p>
                    </span>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7739.282534077277!2d-87.2014301886248!3d14.098341589117545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6fa2c6f629ea07%3A0x6108a23ce7d56bc1!2sLos%20Toneles!5e0!3m2!1ses-419!2sus!4v1711000131162!5m2!1ses-419!2sus"
                        // width="200" height="200" style={{ border: 0 }} loading="lazy"></iframe>
                        //MAKE THE WIDTH AND HEIGHT OF THE IFRAME RESPONSIVE
                        width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>


                </div>
            </div>
        </div>
    );
};

export default ContactPage;
