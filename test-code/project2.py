def inicializar():
        global cant_jpolos
        global cant_jcamisas
        global cant_jcuellos
        global cant_jpantalones
        global cant_ppolos
        global cant_pcamisas
        global cant_pcuellos
        global cant_ppantalones
        global cant_fpolos
        global cant_fcamisas
        global cant_fcuellos
        global cant_fpantalones
        global tela_jersey
        global tela_pique
        global tela_franela
        global velocidades
        global hilos
        global ganancias

        cant_jpolos = int(input("Ingrese la cantidad de polos jersey: \n"))
        cant_jcamisas = int(input("Ingrese la cantidad de camisas jersey: \n"))
        cant_jcuellos = int(input("Ingrese la cantidad de cuellos jersey: \n"))
        cant_jpantalones = int(input("Ingrese la cantidad de pantalones jersey: \n"))

        cant_ppolos = int(input("Ingrese la cantidad de polos piqué: \n"))
        cant_pcamisas = int(input("Ingrese la cantidad de camisas piqué: \n"))
        cant_pcuellos = int(input("Ingrese la cantidad de cuellos piqué: \n"))
        cant_ppantalones = int(input("Ingrese la cantidad de pantalones piqué: \n"))

        cant_fpolos = int(input("Ingrese la cantidad de polos franela: \n"))
        cant_fcamisas = int(input("Ingrese la cantidad de camisas franela: \n"))
        cant_fcuellos = int(input("Ingrese la cantidad de cuellos franela: \n"))
        cant_fpantalones = int(input("Ingrese la cantidad de pantalones franela: \n"))

        tela_jersey = [cant_jpolos*0.2,cant_jcamisas*0.5,cant_jcuellos*0.05,cant_jpantalones*0.7]
        tela_pique = [cant_ppolos*0.3,cant_pcamisas*0.5,cant_pcuellos*0.07,cant_ppantalones*0.8]
        tela_franela = [cant_fpolos*0.5,cant_fcamisas*1,cant_fcuellos*0.1,cant_fpantalones*1]

        velocidades = [ [tela_jersey[0]*31.2, tela_jersey[1]*31.5, tela_jersey[2]*31.05, tela_jersey[3]*31.5],
                        [tela_pique[0]*31.22, tela_pique[1]*31.33, tela_pique[2]*31.04, tela_pique[3]*31.33],
                        [tela_franela[0]*31.25, tela_franela[1]*31.5, tela_franela[2]*31.05, tela_franela[3]*31.5]  ]

        hilos = []
        ganancias = []

def calculo_materia_prima():
        kg_jersey, kg_pique, kg_franela = 0,0,0

        for i in tela_jersey:
                kg_jersey = kg_jersey + i
        for i in tela_pique:
                kg_pique = kg_pique + i
        for i in tela_franela:
                kg_franela = kg_franela + i

        hilo_jersey = kg_jersey/0.7
        hilo_pique = kg_pique/0.5
        hilo_franela = kg_franela/0.3

        hilos.append(round(hilo_jersey,2))
        hilos.append(round(hilo_pique,2))
        hilos.append(round(hilo_franela,2))

        mat_pri = hilo_jersey + hilo_pique + hilo_franela

        return print("Se necesitará",round(mat_pri,2),"kg de hilo en total")

def calculo_tiempos():
        global tiempo_jersey
        global tiempo_pique
        global tiempo_franela
        global fechas_entrega
        tiempo_pique, tiempo_jersey, tiempo_franela = 0,0,0

        for i in velocidades:
                for j in i:
                        if i==velocidades[0]:
                                tiempo_jersey = tiempo_jersey + j
                        if i==velocidades[1]:
                                tiempo_pique = tiempo_pique + j
                        if i==velocidades[2]:
                                tiempo_franela = tiempo_franela + j

        tiempos = [tiempo_jersey, tiempo_pique, tiempo_franela]
        fechas_entrega = []

        from datetime import date, datetime, timedelta
        for i in tiempos:
                ahora = datetime.now() + timedelta(hours=i)
                fecha_entrega = ahora.strftime("%d-%m-%y a las %H:%m")
                fechas_entrega.append(fecha_entrega)

def calculo_costos():
        precios = [[cant_jpolos*30, cant_jcamisas*50, cant_jcuellos*5, cant_jpantalones*50],
                [cant_ppolos*60, cant_pcamisas*75, cant_pcuellos*10, cant_ppantalones*75],
                [cant_fpolos*60, cant_fcamisas*80, cant_fcuellos*15, cant_fpantalones*80]  ]
        
        precio_j = precios[0][0] + precios[0][1] + precios[0][2] + precios[0][3]
        precio_p = precios[1][0] + precios[1][1] + precios[1][2] + precios[1][3]
        precio_f = precios[2][0] + precios[2][1] + precios[2][2] + precios[2][3]

        global ganancia_jersey
        global ganancia_pique
        global ganancia_franela

        ganancia_jersey = precio_j - hilos[0]*10
        ganancia_pique = precio_p - hilos[1]*10
        ganancia_franela = precio_f - hilos[2]*10
        
        ganancias.extend([round(precios[0][0]-tela_jersey[0]/0.7*10,2), round(precios[0][1]-tela_jersey[1]/0.7*10,2), round(precios[0][2]-tela_jersey[2]/0.7*10,2), round(precios[0][3]-tela_jersey[3]/0.7*10,2),
                        round(precios[1][0]-tela_pique[0]/0.5*10,2), round(precios[1][1]-tela_pique[1]/0.5*10,2), round(precios[1][2]-tela_pique[2]/0.5*10,2), round(precios[1][3]-tela_pique[3]/0.5*10,2),
                        round(precios[2][0]-tela_franela[0]/0.3*10,2), round(precios[2][1]-tela_franela[1]/0.3*10,2), round(precios[2][2]-tela_franela[2]/0.3*10,2), round(precios[2][3]-tela_franela[3]/0.3*10,2)      ])

def dictio():
        global dict_busqueda
        dict_busqueda = { "polos jersey": [velocidades[0][0], ganancias[0]], "camisas jersey": [velocidades[0][1], ganancias[1]], "cuellos jersey": [velocidades[0][2], ganancias[2]], "pantalones jersey": [velocidades[0][3], ganancias[3]],
                        "polos pique": [velocidades[1][0], ganancias[4]], "camisas pique": [velocidades[1][1], ganancias[5]], "cuellos pique": [velocidades[1][2], ganancias[6]], "pantalones pique": [velocidades[1][3], ganancias[7]],
                        "polos franela": [velocidades[2][0], ganancias[8]], "camisas franela": [velocidades[2][1], ganancias[9]], "cuellos franela": [velocidades[2][2], ganancias[10]], "pantalones franela": [velocidades[2][3], ganancias[11]]       }

def busqueda_prendas():
        prenda_buscar = str(input("Ingrese la prenda que desea buscar: \n"))
        while prenda_buscar!="No" and prenda_buscar in dict_busqueda:
                prenda_buscar.lower()
                print("El tiempo de producción de",prenda_buscar,"será de: ",round(dict_busqueda[prenda_buscar][0],2),"horas, y su ganancia será de: ",dict_busqueda[prenda_buscar][1]," soles.")
                prenda_buscar = str(input("Si desea buscar otra prenda, ingrésela aqui. Si no, escriba 'No' "))
        if prenda_buscar not in dict_busqueda and prenda_buscar != "No":
                print("Prenda no encontrada")

def software_priorizar():
        import operator

        dict_tiempos = {"JERSEY":round(tiempo_jersey,2), "PIQUE":round(tiempo_pique,2), "FRANELA":round(tiempo_franela,2)}
        tiempo_ordenado = sorted(dict_tiempos.items(), key=operator.itemgetter(1))
        dict_ganancias = {"JERSEY":round(ganancia_jersey,2), "PIQUE":round(ganancia_pique,2), "FRANELA":round(ganancia_franela,2)}
        ganancia_ordenado = sorted(dict_ganancias.items(), key=operator.itemgetter(1), reverse=True)
        
        listaTiempo = [tiempo_ordenado[0][0],tiempo_ordenado[1][0],tiempo_ordenado[2][0]]
        indexTiempo = {listaTiempo[0]:1, listaTiempo[1]:2, listaTiempo[2]:3}
        
        listaGanancias = [ganancia_ordenado[0][0],ganancia_ordenado[1][0],ganancia_ordenado[2][0]]
        indexGanancias = {listaGanancias[0]:1, listaGanancias[1]:2, listaGanancias[2]:3}

        jersey = indexTiempo["JERSEY"] + indexGanancias["JERSEY"]
        pique = indexTiempo["PIQUE"] + indexGanancias["PIQUE"]
        franela = indexTiempo["FRANELA"] + indexGanancias["FRANELA"]

        if jersey<pique and pique<franela:
                print("Priorizar JERSEY")
        elif pique<jersey and jersey<franela:
                print("Priorizar PIQUE")
        elif franela<jersey and jersey<pique:
                print("Priorizar FRANELA")
        else:
                print("Priorizar",listaGanancias[0])

def tabular():
        listaTabla=[    ["","JERSEY","PIQUE","FRANELA"],
                        ["Fecha de entrega:",fechas_entrega[0],fechas_entrega[1],fechas_entrega[2]],
                        ["Ganancias (soles):",ganancia_jersey,ganancia_pique,ganancia_franela] ]

        for i in range(3):
                for j in range(4):
                        print("%25s"%listaTabla[i][j], end=" ")
                print()

def main():
        inicializar()
        calculo_materia_prima()
        calculo_tiempos()
        calculo_costos()
        tabular()
        dictio()
        var = str(input("¿Desea saber el tiempo de producción y la ganancia de una prenda? Escriba Si/No: \n"))
        if var=="Si":
                busqueda_prendas()
        software_priorizar()

main()