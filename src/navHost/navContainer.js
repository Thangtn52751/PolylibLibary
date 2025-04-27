import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

//Import THE SCREENS
import SplashScreen from '../screen/SplashScreen';
import WelcomeScreen from '../screen/WelcomeScreen';
import LoginScreen from '../screen/LoginScreen';
import UserLoansScreen from '../screen/UserLoansScreen';
import SignUpScreen from '../screen/SignUpScreen';
import ForgotPasswordStep1 from '../screen/ForgotPasswordStep1';
import ForgotPasswordStep2 from '../screen/ForgotPasswordStep2';
import CreateNewPassword from '../screen/CreateNewPassword';
import HomeScreen from '../screen/HomeScreen';
import NotificationScreen from '../screen/NotificationScreen';
import SearchScreen from '../screen/SearchScreen';
import ProfileScreen from '../screen/ProfileScreen';
import BookDetailScreen from '../screen/BookDetailScreen';
import EditProfileScreen from '../screen/EditProfile';
import BookRegScreenEmployee from '../screen/BookRegScreenEmployee';
import ProfileEmployee from '../screen/ProfileEmployee';
import BookReturnEmployee from '../screen/BookReturnEmployee';
import ReturnBook from '../screen/ReturnBook';
import MyRequestsScreen from '../screen/MyRequestsScreen';
import NotificationDetail from '../screen/NotificationDetail';
import LoanSlipScreen from '../screen/MyLoansScreen';
import LoanManageScreen from '../screen/LoanManageScreen';
import RemindUserScreen from '../screen/RemindUserScreen';
import UserListScreen from '../screen/NotificationEmployee';
import RemindLoanScreen from '../screen/RemindLoanScreen';
import AddBookScreen   from '../screen/AddBookScreen';
import EditBookScreen  from '../screen/EditBookScreen';
import BookManagementScreen from '../screen/BookListScreen';
import ProfileAdmin from '../screen/ProfileAdmin';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//Bottom Tab Admin
const AdminBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d67e00',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
      
          if (route.name === 'Register') {
            // Entypo “book” icon
            return <Entypo name="book" size={size} color={color} />;
          }
          if (route.name === 'Returns') {
            // Ionicons swap‑horizontal
            const iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          if(route.name === 'LoanSlip') {
            const iconName = focused ? 'newspaper' : 'newspaper-outline'
            return <Ionicons name={iconName} size={size} color={color}/>

          }
          if (route.name === 'Profile') {
            // Entypo user
            return <Entypo name="user" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Register"
        component={BookRegScreenEmployee}
      />
      <Tab.Screen
        name="Returns"
        component={BookReturnEmployee}
        options={{ title: 'Returns' }}
      />

      <Tab.Screen
      name="LoanSlip"
      component={LoanManageScreen}
      options={{title:'Loans'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileAdmin}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
//Bottom Tab Employee
const EmployeeBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d67e00',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Register') {
            // Entypo “book” icon
            return <Entypo name="book" size={size} color={color} />;
          }
          if (route.name === 'Returns') {
            // Ionicons swap‑horizontal
            const iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          if(route.name === 'LoanSlip') {
            const iconName = focused ? 'newspaper' : 'newspaper-outline'
            return <Ionicons name={iconName} size={size} color={color}/>

          }
          if (route.name === 'Profile') {
            // Entypo user
            return <Entypo name="user" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Register"
        component={BookRegScreenEmployee}
      />
      <Tab.Screen
        name="Returns"
        component={BookReturnEmployee}
        options={{ title: 'Returns' }}
      />

      <Tab.Screen
      name="LoanSlip"
      component={LoanManageScreen}
      options={{title:'Loans'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileEmployee}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
//Bottom Tab User
const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Search") {
          iconName = focused ? "search" : "search-outline";
        } else if (route.name === "Notification") {
          iconName = focused ? "notifications" : "notifications-outline";
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#d67e00",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Notification" component={NotificationScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
)
const NavContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordStep1" component={ForgotPasswordStep1} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordStep2" component={ForgotPasswordStep2} options={{ headerShown: false }} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ headerShown: true , title:"Book Deatail"}} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{title:"Edit Profile"}}/>
        <Stack.Screen name="Employee" component={EmployeeBottomTabs} options={{headerShown:false}}/>
        <Stack.Screen name="NotificationDetail" component={NotificationDetail} options={{headerShown:false}}/>
        <Stack.Screen name= "MyRequest" component={MyRequestsScreen} options={{title:"Your Request"}}/>
        <Stack.Screen name="LoanSlip" component={LoanSlipScreen} options={{title:"Book Loans Slip"}}/>
                <Stack.Screen
          name="ReturnUser"
          component={ReturnBook}
          options={{ title: 'Return Borrowed Books' }}
        />
      <Stack.Screen name ="BookManagement" component={BookManagementScreen} options={{title:"Book Management"}}/>
        <Stack.Screen
        name="RemindUser"
        component={RemindUserScreen}
       options={{ title:'Send Reminder' }}
        />
        <Stack.Screen name="UserList" component={UserListScreen} options={{title:'Pick a User'}}/>
<Stack.Screen name="UserLoans" component={UserLoansScreen} options={{title:'Their Loans'}}/>
<Stack.Screen name="RemindLoan" component={RemindLoanScreen} options={{title:'Send Reminder'}}/>
<Stack.Screen name="Admin" component={AdminBottomTabs} options={{headerShown:false}}/>
<Stack.Screen name="AddBook"  component={AddBookScreen}  />
<Stack.Screen name="EditBook" component={EditBookScreen} />
      </Stack.Navigator>
    
    </NavigationContainer>
  );
};

export default NavContainer;
