package com.example.backend.service;

import com.example.backend.api.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserService(){
    }

    public User getUser(Integer id){
        return new User("John", id.toString(), "");
    }
}
