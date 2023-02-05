package pt.unl.fct.di.iadidemo.bookshelf.application.services

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import pt.unl.fct.di.iadidemo.bookshelf.domain.UserDAO
import pt.unl.fct.di.iadidemo.bookshelf.domain.UserRepository
import java.util.*

@Service
class UserService(val users: UserRepository) {

    fun findUser(username:String) = users.findById(username)

    fun addUser(user: UserDAO) : Optional<UserDAO> {
        val aUser = users.findById(user.username)

        return if ( aUser.isPresent )
            Optional.empty()
        else {
            user.password = BCryptPasswordEncoder().encode(user.password)
            Optional.of(users.save(user))
        }
    }
}