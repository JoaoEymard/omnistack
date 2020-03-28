import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import logoImg from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import styles from './style';

export default function Incidents() {
    const [ incidents, setIncidents ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const navigation = useNavigation();

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents() {
        if (loading) return;
        if (total > 0 && incidents.length === total) return;

        setLoading(true);
        const response = await api.get('/incidents', {
            params: { page }
        });

        setTotal( response.headers['x-total-count'] );
        setIncidents([ ... incidents, ... response.data ]);
        setPage(page +1);
        setLoading(false);
    }

    useEffect(() => {
        loadIncidents();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg}></Image>

                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{ total } casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia</Text>

            <FlatList
                style={styles.incidentList}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={ false }
                onEndReached={ loadIncidents }
                onEndReachedThreshold={ 0.2 }
                renderItem={({ item: incident }) => (
                    <View style={styles.incident}>
                        <View style={styles.incidentHeader}>
                            <View>
                                <Text style={styles.incidentProperty}>ONG:</Text>
                                <Text style={styles.incidentValue}>{ incident.name }</Text>
                            </View>
                            <View>
                                <Text style={[styles.incidentProperty, { textAlign: 'right' }]}>VALOR:</Text>
                                <Text style={styles.incidentValue}>
                                    { Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value) }
                                </Text>
                            </View>
                        </View>
                        
                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{ incident.title }</Text>

                        <TouchableOpacity 
                            style={styles.detailsButton} 
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#e02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}